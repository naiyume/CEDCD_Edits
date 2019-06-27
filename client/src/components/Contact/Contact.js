import React, { Component } from 'react';

class Contact extends Component {

    constructor(props){
      super(props);
      this.state = {
        open:false,
        submitted:false,
        firstname_required:false,
        lastname_required:false,
        org_required:false,
        email_required:false,
        message_required:false,
        firstname:"",
        lastname:"",
        organization:"",
        phone:"",
        email:"",
        topic:"1",
        message:""
      };
    }

    handleClick =() =>{
      this.setState({
        open:!this.state.open
      });
    }

    handleClear =() =>{
      this.setState({
        firstname_required:false,
        lastname_required:false,
        org_required:false,
        email_required:false,
        message_required:false,
        firstname:"",
        lastname:"",
        organization:"",
        phone:"",
        email:"",
        topic:"1",
        message:""
      });
    }

    handleChange(field, event){
      let dict = {};
      dict[field] = event.target.value;
      this.setState(dict);
    }

    handleSubmit =(event) =>{
      event.preventDefault();
      //check required field
      const state = Object.assign({},this.state);
      state.firstname_required = state.firstname.trim() === "";
      state.lastname_required = state.lastname.trim() === "";
      state.org_required = state.organization.trim() === "";
      state.email_required = state.email.trim() === "";
      state.message_required = state.message.trim() === "";
      if(state.firstname_required || state.lastname_required || state.org_required || state.email_required || state.message_required){
        this.setState(state);
      }
      else{
        //submit
        let reqBody = {
          firstname:state.firstname,
          lastname:state.lastname,
          organization:state.organization,
          phone:state.phone,
          email:state.email,
          topic:state.topic,
          message:state.message
        };
        fetch('./api/contact/add',{
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result => {
          let data = result.data;
          state.submitted = data === "sent";
          this.setState(state);
          setTimeout(() =>{
            this.setState({
              submitted:!this.state.submitted,
              firstname_required:false,
              lastname_required:false,
              org_required:false,
              email_required:false,
              message_required:false,
              firstname:"",
              lastname:"",
              organization:"",
              phone:"",
              email:"",
              topic:"1",
              message:""
            });
          }, 1500);
        });
      }
    }

  render() {
    let cls = ["pop-content"];
    let shadow = "";
    if(this.state.open){
      cls.push("open");
      shadow = "shadow";
    }
    let firstname_cls = this.state.firstname_required?"contact-us-field field-required":"contact-us-field";
    let lastname_cls = this.state.lastname_required?"contact-us-field field-required":"contact-us-field";
    let org_cls = this.state.org_required?"contact-us-field field-required":"contact-us-field";
    let email_cls = this.state.email_required?"contact-us-field field-required":"contact-us-field";
    let message_cls = this.state.message_required?"contact-us-field field-required":"contact-us-field";
    const submit_cls = this.state.submitted?"message-top fade-away":"message-top";
    return (
      <div>
              <div className={submit_cls}>
                Message sent successfully.    
              </div>  
              <div id="contactForm" className="row pop-form">
                <div id="contact-main" className="col">
                  <div id="contact-header" className="col-md-12">
                    <h1 className="pg-title">Contact</h1>             
                  </div>
                  <div id="contact-col-1" className="col-md-6 contact-col">
                    <form onSubmit={this.handleSubmit}>  
                      <p id="ctl11_rg_errorMsg" className="bg-danger"></p>
                      <div id="ctl11_div_firstname" className={firstname_cls}>
                        <label className="oneLineLabel"  htmlFor="cu_firstName">First Name <span className="required">*</span></label>
                        <input name="cu_firstName" type="text" id="cu_firstName" value={this.state.firstname} onChange={(e) =>this.handleChange("firstname",e)}/>
                      </div>
                      <div id="ctl11_div_lastname" className={lastname_cls}>
                        <label className="oneLineLabel" htmlFor="cu_lastName">Last Name <span className="required">*</span></label>
                        <input name="cu_lastName" type="text" id="cu_lastName" value={this.state.lastname} onChange={(e) =>this.handleChange("lastname",e)}/>
                      </div>
                      <div id="ctl11_div_organization" className={org_cls}>
                        <label className="oneLineLabel" htmlFor="cu_organization">Organization <span className="required">*</span></label>
                        <input name="cu_organization" type="text" id="cu_organization" value={this.state.organization} onChange={(e) =>this.handleChange("organization",e)}/> 
                      </div>
                      <div id="ctl11_div_phone" className="contact-us-field">
                        <label className="oneLineLabel" htmlFor="cu_phone">Phone Number</label>
                        <input name="cu_phone" type="text" id="cu_phone" placeholder="(   )   -" value={this.state.phone} onChange={(e) =>this.handleChange("phone",e)}/>
                      </div>
                      <div id="ctl11_div_email" className={email_cls}>
                      <label className="oneLineLabel" htmlFor="cu_email">Email <span className="required">*</span></label>
                      <input name="cu_email" type="text" id="cu_email" value={this.state.email} onChange={(e) =>this.handleChange("email",e)}/>
                      </div>
                      <div id="div_topic" className="contact-us-field">
                      <label className="oneLineLabel" htmlFor="cu_topic">Topic <span className="required">*</span></label>
                      <select name="cu_topic" id="cu_topic" className="textEntrySmall" value={this.state.topic}  onChange={(e) =>this.handleChange("topic",e)}>
                        <option value="1">General CEDCD Inquiry</option>
                        <option value="2">Report a Bug</option>
                        <option value="3">Question for NCI CEDCD Researcher Team</option>
                        <option value="4">Other Issues</option>
                      </select>
                      </div>
                      <div id="ctl11_div_message" className={message_cls}>
                      <label className="oneLineLabel" htmlFor="cu_message">Message <span className="required">*</span></label>
                      <textarea name="cu_message" rows="4" cols="20" id="cu_message" value={this.state.message} onChange={(e) =>this.handleChange("message",e)}/>
                      </div>
                      <div className="bttn-group">
                          <input type="submit"className="bttn_submit" value="Submit" />
                          <a id="ctl11_fg_cancelBtn" className="bttn_cancel" href="javascript:void(0);" onClick={this.handleClear}>Clear</a>
                      </div>
                    </form>
                  </div>
                  <div id="contact-col-2" className="col-md-6 contact-col">
                    <h2>General Inquiries</h2>
                    <p>For questions about the website or the CEDCD project, fill out the contact form. To help us respond to your query, please provide as much detail as possible.</p>
                    <h2>Website Technical Assistance</h2>
                        <p>For technical issues or bugs, include the following information:</p>
                        <ul>
                          <li>Platform (i.e., PC, Mac)</li>
                          <li>Operating system (i.e., Windows XP, Windows 7, Mac OS X)</li> 
                            <li>Browser name and version (i.e., Internet Explorer 6, Chrome 18)</li>
                      </ul>
                    <h2>Contacting a Specific Cohort</h2> 
                    <p>You can find contact info for each cohort on their <span style={{fontWeight:"bold"}}>Cohort Profile</span> page.</p>
                  </div>
                </div>
          </div>
        </div>
    );
  }
}

export default Contact;