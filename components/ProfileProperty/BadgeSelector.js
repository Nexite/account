import React, { useState } from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import PropTypes from 'prop-types';
import Text from '@codeday/topo/Atom/Text';
import Input from '@codeday/topo/Atom/Input/Text';
import { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import FormControl, { Label, HelpText } from '../FormControl';
import { Tooltip } from '@chakra-ui/core';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/core"

export const Badge = ({ badge, disabled, onClick, onChange}) => {
  const [tooltipOpen, setTooltipOpen] = useState(true);
  if (!badge) {
    return (
      <Tooltip hasArrow isDisabled={disabled ? true : false} label="None" placement="auto" fontSize="md" zIndex="101">
          <Button width="18" disabled={disabled ? true : false} onClick={onClick} onChange={onChange}>❌</Button>
      </Tooltip>
    );
  }
  return (
    <Tooltip hasArrow isDisabled={disabled ? true : false} label={badge.details.name} placement="auto" fontSize="md" zIndex="101">
        <Button width="18" disabled={disabled ? true : false} onClick={onClick} onChange={onChange}>{badge.details.emoji}</Button>
    </Tooltip>
  );
}

// export default { BadgeSelector, Badge }