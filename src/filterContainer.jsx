const React = require('react');
const Tag = require('./tag.jsx');

const FilterContainer = React.createClass({
  componentWillMount: () => {
    this.fire_response();
  },
  fire_response: () => {
    const $this = this;
    streamingClient = REQUEST.GET_STREAMING_CLIENT();
    const stream_on = REQUEST.FIRE_FILTER(this.props.CITY_LIST, this.props.TOPIC_LIST);
    stream_on.on('data', (res) => {
      $this.props.on_get_data(res);
      $this.stream_start();
    }).on('error', (err) => {});
  },
  stream_start: () => {
    const $this = this;
    streamingClient = REQUEST.GET_STREAMING_CLIENT();
    const stream_on = REQUEST.START_STREAM(this.props.CITY_LIST, this.props.TOPIC_LIST);
    stream_on.on('data', (res) => {
      $this.props.on_get_data(res, true);
    }).on('error', (err) => {});
  },
  set_list: (method, list) => {
    this.props.set_list(method, list);
    this.fire_response();
  },
  render: () => {
    return (
      <div className='meetup-filter-container'>
        <Tag key='0' type='city'
        set_list={} list={this.props.CITY_LIST}
        fire_response={this.fire_response}></Tag>
        <Tag key='1' type='topic'
        set_list={this.set_list}
        list={this.prop.TOPIC_LIST}
        fire_response={this.fire_response}></Tag>
      </div>
    )
  }
});

module.exports = FilterContainer;
