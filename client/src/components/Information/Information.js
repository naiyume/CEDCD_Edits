import React, { Component } from 'react';
import './Information.css';
import Moment from 'react-moment';
import qs from 'query-string';


class Information extends Component {

	constructor(props){
		super(props);
		const id = qs.parse(this.props.location.search).id;
		this.state={
			hasMounted: false,
			cohort_id: id,
			info:{},
			description:true,
			protocol:false,
			data:false
		};
	}

	goBack = () => {
		this.props.history.goBack();
	}

	descriptionClick = () => {

		this.setState({
			description:!this.state.description
		});
	}

	protocolClick = () => {
		this.setState({
			protocol:!this.state.protocol
		});
	}
	
	dataClick = () => {
		this.setState({
			data:!this.state.data
		});
	}

	renderLinks = (idx) => {
		if(idx === 0){
			if(this.state.info.attachments && this.state.info.attachments.protocols){
				const links = this.state.info.attachments.protocols.map((item, id) => {
					const uid = "protocol_"+id;
					if(item.type === 1){
						return (
							<li key={uid} className="link-pdf">
								<a href={item.url}  target="_blank">{item.name}</a>
							</li>
						);
					}
					else{
						let url = item.url;
						if(!url.startsWith("http")){
							url = "http://"+url;
						}
						return (
							<li key={uid} className="link-url">
								<a href={url} target="_blank">{item.url}</a>
							</li>
						);
					}
					
				});
				return (
					<ul className="links-list">
						{links}
					</ul>
				);
			}
			else{
				return (
					<ul>
						<li>Not Provided</li>
					</ul>
				);
			}
		}
		else if(idx === 1){
			if(this.state.info.attachments && this.state.info.attachments.questionnaires){
				const links = this.state.info.attachments.questionnaires.map((item, id) => {
					const uid = "questionnair_"+id;
					if(item.type === 1){
						return (
							<li key={uid} className="link-pdf">
								<a href={item.url}  target="_blank">{item.name}</a>
							</li>
						);
					}
					else{
						let url = item.url;
						if(!url.startsWith("http")){
							url = "http://"+url;
						}
						return (
							<li key={uid} className="link-url">
								<a href={url} target="_blank">{item.url}</a>
							</li>
						);
					}
					
				});
				return (
					<ul className="links-list">
						{links}
					</ul>
				);
			}
			else{
				return (
					<ul>
						<li>Not Provided</li>
					</ul>
				);
			}
		}// end idx ==1 
		else{
			
			// combination of  basic info request_procedures_web_url and attachments policies 
			let has = false;  // has == true -> not provided 
			let request_web_url = this.state.info.request_procedures_web_url;
			let return_body =[]
			// check if is a valid web url
			if(!request_web_url.startsWith("http") && !request_web_url.startsWith("www") && !request_web_url.startsWith("wiki.")){
				// nothing to do 
			}else{
				has=true
				return_body.push(
							<li className="link-url" key="request_procedures_web_url_key">
								<a href={request_web_url} target="_blank">{request_web_url}</a>
							</li>
					)
			}

			if(this.state.info.attachments && this.state.info.attachments.policies){
				// map return 
				const links = this.state.info.attachments.policies.map((item, id) => {
					const uid = "policy_"+id;
					if(request_web_url !== ""&&request_web_url.trim() == item.url.trim()){
						return;
					}
					if(item.type === 1){
						has = true;
						return_body.push(
							<li key={uid} className="link-pdf">
								<a href={item.url}  target="_blank">{item.name}</a>
							</li>
						)
					}
					else{
						let url = item.url;
						if(!url.startsWith("http")){
							url = "http://"+url;
						}
						has = true;
						return_body.push(
							<li key={uid} className="link-url">
								<a href={url} target="_blank">{item.url}</a>
							</li>
						)
					}
				}); // end mapping
			}
			if(!has){
					return (
						<ul>
							<li>Not Provided</li>
						</ul>
					);
			}else{
				return <ul> {return_body} </ul>;
			}
		}// end else 
	}
	
	componentDidMount(){
		fetch('./api/cohort/'+this.state.cohort_id)
			.then(res => res.json())
			.then(result => {
				let info = result.data;
				this.setState(prevState => (
					{
						hasMounted: true,
						cohort_id: prevState.cohort_id,
						info:info,
						description:true,
						protocol:false,
						data:false
					}
				));
			});
	}

  render() {
  	if(!this.state.hasMounted){
  		return (<div id="prof-main"></div>);
  	}
  	else{
  		const info = this.state.info;
	  	const mailto = "mailto:"+info.collab_email;
	  	let pis = [1,2,3,4,5,6].map((item, idx) => {
	  		let result;
	  		let prop_1 = "pi_name_"+item;
	  		let prop_2 = "pi_institution_"+item;
	  		if(info[prop_1] && info[prop_1].trim() !== ""){
	  			result = (
		  			<li key={item}>
		  				{info[prop_1]} ({info[prop_2]})
		  			</li>
		  		);
	  		}
	  		else{
	  			result = "";
	  		}
	  		return result;
	  	});
	  	let website;
	  	if(info.cohort_web_site && info.cohort_web_site.trim() !== "Not Available"&& info.cohort_web_site.trim() !== ""){
	  		website = (
	  			<a href={info.cohort_web_site} id="cd_website" className="link-url" target="_blank">Cohort Website</a> 
	  		);
	  	}
	  	else{
	  		website = <a href="#" id="cd_website" className="link-url">Cohort Website (Not Provided)</a> ;
	  	}
	  	let desc = "<p>"+info.cohort_description+"</p>";
	  	desc = desc.replace(/\n/g,'<br/>');
	  	let description = {
			className:"cedcd-btn " + (this.state.description?"active":""),
			expanded:this.state.description?"true":"false",
			hidden:this.state.description?"false":"true",
			style:{display:this.state.description?"block":"none"}
		};
		let protocol = {
			className:"cedcd-btn " + (this.state.protocol?"active":""),
			expanded:this.state.protocol?"true":"false",
			hidden:this.state.protocol?"false":"true",
			style:{display:this.state.protocol?"block":"none"}
		};
		let data = {
			className:"cedcd-btn " + (this.state.data?"active":""),
			expanded:this.state.data?"true":"false",
			hidden:this.state.data?"false":"true",
			style:{display:this.state.data?"block":"none"}
		};
	  	return (
	        <div id="prof-main">
	          <div id="prof-header">
	            <a className="back" href="javascript:void(0);" onClick={this.goBack}><i className="fas fa-chevron-left"></i>&nbsp;<span>Back to previous page</span></a>
	            <h2 className="pg-title"><span id="cd_name">{info.cohort_name}</span> (<span id="cd_acronym">{info.cohort_acronym}</span>)</h2>
	            <div className="rightLink"> <span className="lastUpdated">Last Updated: <span id="cd_lastupdate"><Moment format="MM/DD/YYYY">{info.update_time}</Moment></span></span> </div>
	            <div id="cd_errorMsg" className="errorText"></div>
	          </div>
	          <div className="row topMatter">
	            <div className="cohortInfo col-md-6">
	              <h3>Cohort Collaboration Contact</h3>
	              <p className="profile-contact-intro" style={{fontStyle:'italic',fontSize:'.80em'}}>If interested in collaborating with the cohort on a project, please contact:</p>
	              <ul id="cd_contact">
	              <li>{info.collab_name} ({info.collab_position})</li>
	              <li className="link-email">
	              	<a href={mailto}>
	              		<i className="far fa-envelope"></i> {info.collab_email}</a></li><li><i className="fas fa-phone"></i> {info.collab_phone}</li></ul>
	            </div>
	            <div className="cohortInfo col-md-6 last">
	              <h3>Principal Investigators</h3>
	              <ul id="piList">{pis}</ul>
	              {website}
	            </div>
	          </div>
	          <div className="row bottomMatter">
	            <div id="attachments" className="cohortInfo col-md-12">
	              <button type="button" className={description.className} aria-expanded={description.expanded} aria-controls="more" onClick={this.descriptionClick}><span className="triangle"></span>Cohort Description</button>
	              <div className="cohortInfoBody" id="more" aria-hidden={description.hidden} style={description.style}>
					<div id="cd_description" dangerouslySetInnerHTML={{__html: desc}}/>
	              </div>
	              <button type="button" className={protocol.className} aria-expanded={protocol.expanded} aria-controls="protocols" onClick={this.protocolClick}><span className="triangle"></span>Questionnaires</button>
	              <div className="cohortInfoBody" id="protocols" aria-hidden={protocol.hidden} style={protocol.style}>
	                <h3 style={{"display":"none"}}>Study Protocol</h3>
	                <div id="prot_attachments" style={{"display":"none"}}>
	                	{this.renderLinks(0)}
	                </div>
	                <h3>Cohort Questionnaires</h3>
	                <div id="quest_attachments">
	                  	{this.renderLinks(1)}
	                </div>
	              </div>
	              <button type="button" className={data.className} aria-expanded={data.expanded} aria-controls="policies" onClick={this.dataClick}><span className="triangle"></span>Data, Biospecimen, and Authorship Policies</button>
	              <div className="cohortInfoBody" id="policies" aria-hidden={data.hidden} style={data.style}>
	                <div id="pol_attachments">
	                  	{this.renderLinks(2)}
	                </div>
	              </div>
	            </div>
	          </div>
	        </div>
	      );
  	}
  	
  }
}

export default Information;