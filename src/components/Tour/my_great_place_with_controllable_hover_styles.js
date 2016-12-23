const K_SIZE = 40;

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_SIZE,
  height: K_SIZE,
  left: -K_SIZE / 2,
  top: -K_SIZE / 2,

  border: '3px solid black',
  borderRadius: K_SIZE,
  backgroundColor: 'white',
  textAlign: 'center',
  color: 'black',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer'
};

const greatPlaceStyleHover = {
  ...greatPlaceStyle,
  border: '3px solid red',
  color: '#f44336'
};

export {greatPlaceStyle, greatPlaceStyleHover, K_SIZE};
