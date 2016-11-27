const React = require('react');
const FilterContainer = require('./filterContainer.jsx');
const User = require('./user.jsx');

const Container = React.createClass({
  getInitialState() {
     return {
       users: [],
       CITY_LIST: [],
       TOPIC_LIST: []
    };
  },
  componentDidMount: () => {
    const $this = this;
    this.make_responsive();
    $('.meetup-record-holder').on('scroll', () => {
      if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight){
        const stream_on = REQUEST.PAGINATION($this.state.CITY_LIST, $this.state.TOPIC_LIST);
        stream_on_done((res) => {
          $this.on_get_data(res, true);
        }).fail('error', (err) => {});
      }
    });
  },
  make_responsive: () => {
    sizeSet(){
      const window_height = $(window).height() - 15;
      $('.meetup-record-holder').css('height', window_height);
    };
    size_set();
    $(window).resize(() => {
      size_set();
    });
  },
  on_get_data: (res, append) => {
    const $this = this;
    if(res.hasOwnProperty('hits'){
      if(append){
        const arr = $this.state.users;
        const new_array = $.merge(arr, record_array);
          $this.setState({
            users: new_array
          });
      } else {
        record_array = record_array.reverse();
          $this.setState({
            users: record_array
          });
      }
    } else {
      const arr = $this.state.users;
      arr.unshift(res);
      $this.setState({
        users: arr
      });
    }
  },
  set_list: (method, list) => {
    if(method === 'city'){
      this.setState({
        CITY_LIST: list
      });
    } else {
      this.setState({
        TOPIC_LIST: list
      });
    }
  },
  render: () => {
    const $this = this;
    return(
      <div className='row meetup-container'>
        <FilterContainer key='1'
          on_get_data = {this.on_get_data}
          CITY_LIST = {this.state.CITY_LIST}
          TOPIC_LIST = {this.state.TOPIC_LIST}
          set_list = {this.set_list}>
        </FilterContainer>
        <div className='meetup-record-holder' id='meetup-record-holder'>
          <div className='container full_row' id='record-container'>
            {this.state.users.map((single_user1, i) => {
              const single_user = single_user1._source;
              return (
                <User
                  key = {i}
                  index = {i}
                  name = {single_user.member.member_name}
                  img = {single_user.member.photo}
                  event_name = {single_user.event.event_name}
                  group_city = {single_user.group.group_city}
                  group_topics = {single_user.group.group_topics}
                  event_url = {single_user.event.event_url}
                  TOPIC_LIST = ($this.state.TOPIC_LIST)
                  CITY_LIST = ($this.state.CITY_LIST)
                  ></User>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Container;
