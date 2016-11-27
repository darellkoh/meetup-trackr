const React = require('react');
const Tag = React.createClass({
  getInitialState(){
    return {
      list: []
    };
  },
  CHECK_CHANGE(eve, list, container) {
    const $this = this;
    const checkbox_val = $(eve).val();
    const type = $(eve).attr('container');
    const check2 = checkbox_val;
    if($(eve).is(':checked')){
      list.push(check2);
      const tag_text = $('<span>').addClass('tag_text').text(checkbox_val);
      const tag_close = $('<span>').addClass('tag_close').text('x').attr('val', checkbox_val);
      const single_tag = $('<span>').addClass('single_tag').attr('val', checkbox_val).append(tag_text).append(tag_close);
      $(tag_close).click(() => {
        const val = $(this).attr('val');
        $(single_tag).remove();
        list.remove(val);
        $this.props.set_list(type, list);
        container.find('.tag_checkbox[value="' + val + '"]').prop('checked', false);
      });
      container.find('.tag_name').append(single_tag);
      $this.props.set_list(type, list);
    } else {
      container.find('.single_tag[val="' + checkbox_val + '"]').remove();
      list.remove(check2);
      $this.props.set_list(type, list);
    }
  },
  CREATE_TAG(type, data){
    $this = this;
    const list = this.props.list;
    const container = $('.' + type + '_container');
    const checkbox = $('<input>').attr({
      type: 'checkbox',
      name: 'brand',
      class: 'tag_checkbox',
      container: type,
      value: data
    });
    return single_tag;
  },
  set_filter_list(method, list) {
    const $this = this;
    $('.' + method + '_search').typeahead({
      hint: true,
      highlight: true,
      minLength: 0
    }, {
      name: method,
      source: substringMatcher(list),
      templates: {
        pending: true,
        suggestion: (data) => {
          if(data){
            const single_record = $this.CREATE_TAG(method, data);
            return single_record;
          } else {
            return;
          }
        }
      }
    });
    setTimeout(() => {
      $('.' + method + '_search').typeahead('val', '').focus();
    }, 1000);
  },
  componentWillMount(){
    const $this = this;
    const method = this.props.type;
    REQUEST.GET_TAG_LIST(method, (full_data) => {
      const city_list = [];
      const cities = full_data.aggregations.city.buckets;
      $.each(cities, (i, city) => {
        city_list.push(city.key);
      });
      $this.set_filter_list(method, city_list);
    });
  },
  render() {
    const method = this.props.type + '_search col-xs-12';
    const inside_container = this.props.type + '_container block col-xs-12';s
    return {
      <div key={this.props.key} className={inside_container}>
      <label className='block_label'>Search by {this.props.type}</label>
      <div className='tag_name'></div>
      <div className='full_row'>
        <input type='text' placeholder='search' className={method} />
        <span className='search_thumb glyphicon glyphicon-search'></span>
      </div>
    </div>
    };
  }
});

module.exports = Tag;
