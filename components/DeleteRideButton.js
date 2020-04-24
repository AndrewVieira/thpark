import Popup from '../components/Popup';
import {url} from '../components/Const';

class DeleteRideButton extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			showPop: false
		}
		
		this.togglePop = this.togglePop.bind(this);
		this.delete = this.delete.bind(this);
	}

	togglePop() {
		this.setState((prev, props) => {
			const newPop = !prev.showPop;

			return { showPop: newPop };
		});
	}

	async delete() {
		const i = this.props.ride;
		await this.props.removeRide(i);
		this.togglePop();
		this.props.getSetup();
	}

	render() {
		return (
			<div>
				<button title="Delete Ride" class="button is-small" onClick={this.togglePop}>
					<span class="icon has-text-danger">
						<i class="fa fa-times" ></i>
					</span>
				</button>


				<Popup closePopup={this.togglePop} showPop={this.state.showPop} title="Delete Ride" submitText="Delete" btnFunc={this.delete}>
					<div class="columns">
							<div class="column has-text-centered">
								<h1 class="title">Did you want to delete this ride?</h1>
							</div>
						</div>
				</Popup>
			</div>
		);
	}
};

export default DeleteRideButton;