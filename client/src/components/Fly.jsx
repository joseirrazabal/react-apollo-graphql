import React, {Component} from 'react';
import {gql, graphql} from 'react-apollo';

class Fly extends Component {

	render() {

		const {data: {loading, error, getFly}} = this.props;

		if (loading) {
			return <p>Loading ...</p>;
		}
		if (error) {
			return <p>{error.message}</p>;
		}

		return (
			<div>
				<div style={{height : "50px"}}>
					<div className="floating-box">
						<label>Origen: </label><input id="from"/>
					</div>
					<div className="floating-box">
						<label>Destino: </label><input id="to"/>
					</div>
					<div className="floating-box">
						<button type="button" onClick={ () => console.log("hola ") }>Buscar...</button>
					</div>
				</div>


				<div>
					{getFly && getFly.Flies && getFly.Flies.map((fly , key) => {
						return (
							<div key={key} className="in-box">
								<h4>VUELO ID - {fly.fly_number}</h4>
								<p> Nombre: {fly.name}</p>
								<p> Descripción: {fly.description}</p>
								<p> ID Vuelo: {fly.fly_number}</p>
								<p> Origen : {fly.fly_id.name_origin}</p>
								<p> Destino : {fly.fly_id.name_destiny}</p>
							</div>
						)

					})}
				</div>
			</div>
		)
	}
}

export const flyListQuery = gql`
    query FlyListQuery($search: FlyListQueryInput) {
        getFly(params : $search) {
            name
            description
            fly_number
            fly_id {
                name_origin
                name_destiny
            }
        }
    }
`;

export default (graphql(flyListQuery, {
	options: (props) => ({
		variables: {params: {from: "buenos aires", to: "mexico"}} // --> vincular el formulario con los valores
	}),
})(Fly));