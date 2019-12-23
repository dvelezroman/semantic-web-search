import React from 'react';
import { Button } from '@material-ui/core';

const ButtonComponent = ({ color, text, onPress }) => (
	<Button variant='contained' disableElevation color={color} onClick={onPress}>
		{text}
	</Button>
);
export default ButtonComponent;
