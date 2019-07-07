import React from 'react';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPainting: false,
      line: [],
      lastX: 0,
      lastY: 0,
      prevPos: {
        offsetX: 0,
        offsetY: 0,
      },
      hue: 1,
      direction: true,
      controlDisplay: 'none',
      controlLeft: '100%',
      customColor: false,
      color: '#000000',
      customStroke: false,
      maxWidth: 100,
      minWidth: 5,
    };
    this.canvasRef = React.createRef();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
  }

  prevPos = {offsetX: 0, offsetY: 0};

  onMouseDown({nativeEvent}) {
    const {offsetX, offsetY} = nativeEvent;
    this.setState({
      isPainting: true,
    });
    this.prevPos = {offsetX, offsetY};
  }

  onMouseMove({nativeEvent}) {
    if (this.state.isPainting) {
      const {offsetX, offsetY} = nativeEvent;
      const offSetData = {offsetX, offsetY};
      const positionData = {
        start: {...this.prevPos},
        stop: {...offSetData},
      };
      //Change hue to run through colours
      let hue = this.state.hue;
      this.ctx.strokeStyle = `hsl(${this.state.hue}, 100%, 50%)`;
      hue++;
      if (hue >= 360) {
        hue = 1;
      }
      this.setState({
        hue: hue,
      });
      if (this.ctx.lineWidth >= 100 || this.ctx.lineWidth <= 1) {
        this.direction = !this.direction;
      }
      if (this.direction) {
        this.ctx.lineWidth++;
      } else {
        this.ctx.lineWidth--;
      }
      this.line = this.state.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.state.strokeStyle);
    }
  }
  endPaintEvent() {
    if (this.state.isPainting) {
      this.setState({
        isPainting: false,
      });
    }
  }
  paint(prevPos, currPos, strokeStyle) {
    const {offsetX, offsetY} = currPos;
    const {offsetX: x, offsetY: y} = prevPos;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = {offsetX, offsetY};
  }

  componentDidMount() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.globalCompositeOperation = 'multiply';
  }

  render() {
    return (
      <div>
        <canvas
          ref={ref => (this.canvas = ref)}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}
        />
      </div>
    );
  }
}
export default Canvas;
