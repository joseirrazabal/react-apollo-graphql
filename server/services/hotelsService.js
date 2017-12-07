import { DomainService,	METHOD_TYPES, DomainEntity,	IdType, StringType,	ListType, IntType, BooleanType } from "grpc-graphql-router-tools";

				import services from "../src/grpc/protos/hotels_grpc_pb";
				import messages from "../src/grpc/protos/hotels_pb";

			
			const Rooms = new DomainEntity({
				name: "Rooms",
				fields: () => ({
							type: {
								type: StringType
							},
							price: {
								type: StringType
							}
				})
			});
		
			const Hotel = new DomainEntity({
				name: "Hotel",
				fields: () => ({
							id: {
								type: IntType
							},
							name: {
								type: StringType
							},
							description: {
								type: StringType
							},
							rooms: {
								type: new ListType(Rooms)
							}
				})
			});
		
				export default new DomainService({
			name: "Hotels",
			messages: messages,
			services: services,
			methods: {
				getHotels: {
					name: "getHotels",
					returnField: "hotels",
					type: new ListType(Hotel),
					methodType: METHOD_TYPES.QUERY,
					requestTypeName: "HotelsRequest",
					args: {
							token: {
								type: StringType
							}
					}
				},
				getHotel: {
					name: "getHotel",
					returnField: "hotel",
					type: Hotel,
					methodType: METHOD_TYPES.QUERY,
					requestTypeName: "HotelRequest",
					args: {
							from: {
								type: IntType
							},
							to: {
								type: IntType
							}
					}
				},
			}
		})
		