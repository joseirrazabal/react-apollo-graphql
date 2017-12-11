import React, {Component} from 'react';

var jsonData = []
export default class Streaming extends Component {

	componentDidMount() {
		var source = new EventSource("http://localhost:4000/stream");

		source.onmessage = (event) => {
			console.log("Event --> " , event)
			jsonData.push(event)

			this.setState({
				jsonData : jsonData
			})

		}
	}

	render() {

		return (
			<div>
				Info straeming
				<div style={{height: "50px"}}>

					{this.state && this.state.jsonData && this.state.jsonData.map((value , key) => {
						return (
							<div className="floating-box" key={key}>
								{JSON.parse(value.data).name}
							</div>
						)
					})}
				</div>


			</div>
		)
	}
}