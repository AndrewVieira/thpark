import Layout from '../components/Layout';
import Popup from '../components/Popup';
import RescheduleButton from '../components/RescheduleButton';
import DeleteEventButton from '../components/DeleteEventButton';
import Moment from 'moment';
import moment from 'moment';

import Router from 'next/router';
import {attemptLogin, logout, isLoggedIn, getRole} from '../components/Auth';

import {url} from '../components/Const';

class Events extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			events: [],
			issues: [],
			showEventPop: false,
		}
		
		this.inputEventName   = React.createRef();
		this.inputEventType   = React.createRef();
		this.inputDate	   = React.createRef();
		this.inputLocation   = React.createRef();

		this.getEvents = this.getEvents.bind(this);
		this.toggleEventPop = this.toggleEventPop.bind(this);
		this.addEvent = this.addEvent.bind(this);
		this.removeEvent = this.removeEvent.bind(this);
	}

	async componentDidMount(){
		let role = await getRole();
		if (role !== 'admin' && role !== 'manager'){
			Router.push('/');
		}
		this.getEvents();
	}

	getEvents() {
		fetch(url + "/api/events")
		.then(res => res.json())
		.then (
			(result)=> {
				this.setState({
					events: result
				});
				console.log(result);
			}
		)
	}

	toggleEventPop() {
		this.setState((prev, props) => {
			const newPop = !prev.showEventPop;

			return { showEventPop: newPop };
		});
	}

	async addEvent() {
		console.log(this.inputDate.current.value);
		var data = {
			"event_name": this.inputEventName.current.value,
			"event_type": this.inputEventType.current.value,
			"date": this.inputDate.current.value,
			"location": this.inputLocation.current.value
		};

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
		headers.append('Origin', url);
		
		const res = await fetch(url + "/api/events", {
			body: JSON.stringify(data),
			headers: headers,
			method: 'POST',
			mode: 'cors'
		});
	
		this.getEvents();
		this.toggleEventPop();
	}

	async removeEvent(i) {
		const res = await fetch(url + "/api/events", {
			method: 'DELETE', 
			headers: {'Content-Type': 'application/json; charset=utf-8'}, 
      		body: JSON.stringify({"event_id": i.event_id})
    	});

		this.getEvents();
	};

	render() {
		const events = this.state.events;

		return (
			<Layout>
				<div>
					<button onClick={this.toggleEventPop} class="button is-link is-outlined">
						<span class="icon">
							<i class="fa fa-plus"></i>
						</span>
						<span>Add an event</span>
					</button>

					<Popup closePopup={this.toggleEventPop} showPop={this.state.showEventPop} title="Add an event" submitText="Add event" btnFunc={this.addEvent}>
						<div class="columns">
							<div class="column is-half field">
								<label class="label">Event name</label>
								<div class="control">
									<input ref={this.inputEventName} value={this.state.inputEventName} class="input" type="text" placeholder="Event name" />
								</div>
							</div>
							<div class="column is-half field">
								<label class="label">Type</label>
								<div class="control">
									<select ref={this.inputEventType} class="input" type="text" placeholder="Type" defaultValue="holiday">
										<option value="holiday">Holiday</option>
										<option value="party">Party</option>
										<option value="parade">Parade</option>
										<option value="musical">Musical</option>
										<option value="magic_show">Magic Show</option>
									</select>
								</div>
							</div>
						</div>
						
						<div class="columns">
							<div class="column is-half field">
								<label class="label">Location</label>
								<div class="control">
									<input ref={this.inputLocation} class="input" type="text" placeholder="Location" />
								</div>
							</div>
							<div class="column is-third field">
								<label class="label">Date</label>
								<div class="control">
									<input ref={this.inputDate} class="input" type="date" placeholder="Date" />
								</div>
							</div>
						</div>
						
					</Popup>

					<table class="table">
						<thead>
							<th>Upcoming Events</th>
							<th>Type</th>
							<th>Date</th>
							<th>Location</th>
							<th>Reschedule</th>
							<th>Cancel</th>
						</thead>

						<tbody>
						{
						events.map(i => {
									return (
										<tr>
											<td><b>{i.event_name}</b></td>
											<td>{i.event_type}</td>
											<td>{Moment(i.date).format('M/D/YY')}</td>
											<td>{i.location}</td>
											<td class="has-text-centered">
												<RescheduleButton event={i} getEvents={this.getEvents.bind(this)} />
											</td>
											{/*<td class="has-text-centered">
												<button title="Cancel Event" class="button is-small" onClick={() => this.removeEvent(i)}>
													<span class="icon has-text-danger">
														<i class="fa fa-times"></i>
													</span>
												</button>
											</td>*/}
											<td><DeleteEventButton event={i} getEvents={this.getEvents.bind(this)} cancelEvent={this.removeEvent.bind(this)}/></td>
										</tr>
									);
								})
							}
						</tbody>
					</table>
				</div>
			</Layout>
		)
	}
};

export default Events;

