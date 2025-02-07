import React from 'react';
import { Button } from '@extension/ui';
const ButtonCellRenderer = (props: any) => {
  const onButtonClick = (e: any) => {
    // Prevent the row's onClick event from firing.
    e.stopPropagation();
    // Perform any button-specific logic here.
    console.log('Button clicked in row:', props.data);
  };

  return (
    <Button
      style={{
        width: 'auto',
        height: 'auto',
      }}
      onClick={onButtonClick}>
      {' '}
      Button
    </Button>
  );
};

export default ButtonCellRenderer;
