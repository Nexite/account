import React, { useState } from 'react';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import PropTypes from 'prop-types';
import Text from '@codeday/topo/Atom/Text';
import Input from '@codeday/topo/Atom/Input/Text';
import { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import FormControl, { Label, HelpText } from '../FormControl';
import { Badge } from "./BadgeSelector"
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

const badgeCallback = ({user, query, onChange}) => {
  Badge({user, query, onChange})
}

const Badges = ({user, query, onChange }) => {
  const [userBadges, setBadges] = useState(query.account.user.badges);
  const [displayedBadges, setDisplayedBadges] = useState(query.account.user.displayedBadges);
  return (
    <FormControl>
      <Label fontWeight="bold">Which badges would you like to be displayed?</Label>
      <Grid templateColumns="repeat(3, 1fr)" gap="5px" width="fit-content">
        {displayedBadges.map((displayedBadge, index) => (
          <Popover>
            <PopoverTrigger>
              <Button width="18">{displayedBadge.details.emoji}</Button>
            </PopoverTrigger>
            <PopoverContent zIndex="100">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Pick a badge to display!</PopoverHeader>
              <PopoverBody>
                <Grid templateColumns="repeat(5, 1fr)" gap="1px" width="fit-content">  
                  {userBadges.map((badge) => (
                    <Badge badge={badge} disabled={false} onClick={() => {
                      displayedBadges[index] = badge
                      setDisplayedBadges(displayedBadges)
                    }}></Badge>
                  ))}
                </Grid>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ))}
      </Grid>
    </FormControl>
  );
}

Badges.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Badges.provides = 'user_metadata.badges';

export default Badges;