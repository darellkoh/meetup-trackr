const React = require('react');

const UserImg = React.createClass({
    componentDidMount() {
        const self = this;
        this.img = new Image();
        const defaultSrc = './assets/placeholder_kitten.jpeg';
        this.img.onerror = () => {
            if (self.isMounted()) {
                self.setState({
                    src: defaultSrc
                });
            }
        };
        this.img.src = this.state.src;
    },
    getInitialState() {
        return {
            src: this.props.src
        };
    },
    render() {
        return <img src={this.state.src} />;
    }
});
module.exports = UserImg;
