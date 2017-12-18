package main
/*
nil: is the zero value for pointers, interfaces, maps, slices,
channels and function types, representing an uninitialized value.
*/

import (
	"flag"

	"google.golang.org/grpc"
	"github.com/golang/protobuf/proto"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/testdata"

	pb "fly_guide"

	"net"
	"fmt"
	"log"
	"io/ioutil"
	"encoding/json"
	"golang.org/x/net/context"
)

var (
	tls        = flag.Bool("tls", false, "Connection uses TLS if true, else plain TCP")
	certFile   = flag.String("cert_file", "", "The TLS cert file")
	keyFile    = flag.String("key_file", "", "The TLS key file")
	jsonDBFile = flag.String("json_db_file", "route_fly_db.json", "A json file containing a list of FLY")
	port       = flag.Int("port", 10000, "The server port")
)

type flyServer struct {
	savedFly []*pb.Fly
}

func (flyServer *flyServer) GetFly(ctx context.Context, flyElements *pb.FlyId) (*pb.GetAllFly , error){
	flies := []*pb.Fly{};
	fmt.Println("INIT Server FLY")
	// flyServer.savedFly --> Es el array del json entero.
	for _, fly := range flyServer.savedFly {
		if proto.Equal(fly.FlyId , flyElements) {
			fmt.Println("flyElements --> " , *fly)
			flies = append(flies, fly)

			//time.Sleep(time.Second * 3)
/*			if err := stream.Send(fly); err != nil {
				return err
			}*/
		}
/*		if proto.Equal(fly.FlyId, flyId) {
			return flyServer.savedFly
		}*/
	}
	var flyInit = new (pb.GetAllFly);
	flyInit.Flies = flies;
	// no se encontraron fly, retorna fly_id sin nombre
	// return &pb.Fly{FlyId: flyId}, nil
	return flyInit, nil
}

/*func (s *flyServer) GetFlys(flyRange *pb.FlyRange, stream pb.FlyGuide_GetFlysServer) error {
*//*	for _, fly := range s.savedFeatures {
		if inRange(fly.Location, rect) {
			if err := stream.Send(fly); err != nil {
				return err
			}
		}
	}*//*
	return nil
}*/

// loadFlies: --> carga Flies simulando DDBB.
func (flyServer *flyServer) loadFlies(filePath string) {
	// ver file path para tener en cuenta el archivo y su ruta.
	fmt.Println("dirección archivo --> " , filePath)
	file, err := ioutil.ReadFile(filePath)
	if err != nil {
		log.Fatalf("Failed to load default FLIES: %v", err)
	}
	if err := json.Unmarshal(file, &flyServer.savedFly); err != nil {
		log.Fatalf("Failed to load default FLIES: %v", err)
	}
}

func newServer() *flyServer {
	s := new(flyServer)
	s.loadFlies(*jsonDBFile)
	return s
}

func main() {
	//flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	var opts []grpc.ServerOption
	if *tls {
		if *certFile == "" {
			*certFile = testdata.Path("server1.pem")
		}
		if *keyFile == "" {
			*keyFile = testdata.Path("server1.key")
		}
		creds, err := credentials.NewServerTLSFromFile(*certFile, *keyFile)
		if err != nil {
			log.Fatalf("Failed to generate credentials %v", err)
		}
		opts = []grpc.ServerOption{grpc.Creds(creds)}
	}
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterFlyGuideServer(grpcServer, newServer())
	grpcServer.Serve(lis)
}
