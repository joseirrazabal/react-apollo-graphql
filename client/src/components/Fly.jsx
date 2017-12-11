import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';

class Fly extends Component {

	render() {
		const { data: { loading, error, getFly } } = this.props;

		if (loading) {
			return <p>Loading ...</p>;
		}
		if (error) {
			return <p>{error.message}</p>;
		}

		return (
			<div>
				<div style={{ height: "50px" }}>
					<form name="flyForm">
						<div className="floating-box">
							<label>Origen: </label><input id="from" name="from" />
						</div>
						<div className="floating-box">
							<label>Destino: </label><input id="to" name="to" />
						</div>
						<div className="floating-box">
							<button type="button" onClick={() => {
								this.props.data.refetch({
									search: {
										nameOrigin: document.forms["flyForm"]["from"].value,
										nameDestiny: document.forms["flyForm"]["to"].value
									}
								})
							}}>Buscar...
							</button>
						</div>
					</form>
				</div>
				<div>
					{getFly && getFly.map((fly, key) => {
						return (
							<div key={key} className="in-box">
								<h4>VUELO ID - {fly.fly_number}</h4>
								<p> Nombre: {fly.name}</p>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

export const flyListQuery = gql`
    query FlyListQuery($search: GetFlyInput) {
        getFly(params : $search) {
            name
        }
    }
`;

export default (graphql(flyListQuery, {
	/*	options: (props) => ({
		 variables: {search: {from: "buenos aires", to: "jujuy"}}
		 })*/
})(Fly));