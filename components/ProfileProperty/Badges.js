import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
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



const Badges = ({user, query, onChange }) => {
  const [badges, setBadgeDisplayed] = useReducer((previousBadges, { id, displayed, order }) => {
    if (displayed) {
      previousBadges.map((badge) => { badge.displayed = (badge.order === order ? false : badge.displayed); badge.order = (badge.order === order ? null : badge.order); })
      const displayedBadges = previousBadges.filter((b) => b.displayed == true && b.id !== id).sort((a,b) => a.order - b.order)
      displayedBadges.splice(order, 0, ...previousBadges.filter((b) => b.id === id).map((b) => ({ ...b, displayed, order: (displayed ? order : null) })));
      onChange({ query: { badges: displayedBadges.map((badge) => ({id: badge.id})), username: query.account.user.username } } );
      return [...displayedBadges, ...previousBadges.filter((b) => b.displayed === false && b.id !== id)];
    } else {
      previousBadges.map((badge) => { if (badge.id === id) {badge.displayed = false, badge.order = null}})
      const displayedBadges = previousBadges.filter((b) => b.displayed == true).sort((a,b) => a.order - b.order)
      displayedBadges.map((badge, index) => { badge.order = index })
      onChange({ query: { badges: displayedBadges.map((badge) => ({id: badge.id})), username: query.account.user.username } } );
      return [...displayedBadges, ...previousBadges.filter((b) => b.displayed === false)];
    }
  }, query.account.user.badges);
  const displayedBadges = badges.filter((b) => b.displayed == true).sort((a,b) => a.order - b.order)
  const badgesAlphabetical = [...badges].sort((a, b) => a.id.localeCompare(b.id))

  return (
    <FormControl>
      <Label fontWeight="bold">Which badges would you like to be displayed?</Label>
      <Grid templateColumns="repeat(3, 1fr)" gap="5px" width="fit-content">
        {displayedBadges.map((displayedBadge, index) => (displayedBadge.displayed ?
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
                  {badgesAlphabetical.map((badge) => (
                    <Badge badge={badge} disabled={badge.displayed ? true : false} onClick={() => {
                      // setBadgeDisplayed({ id: displayedBadge.id, displayed: false, order: index })
                      setBadgeDisplayed({ id: badge.id, displayed: true, order: index })
                    }}></Badge>
                  ))}
                  <Badge badge={null} disabled={false} onClick={() => {
                      setBadgeDisplayed({ id: displayedBadge.id, displayed: false, order: index })
                  }}></Badge>
                </Grid>
              </PopoverBody>
            </PopoverContent>
          </Popover> : null
        ))}
        {displayedBadges.length < 3 && 
          <Popover>
          <PopoverTrigger>
              <Button width="18">❌</Button>
          </PopoverTrigger>
          <PopoverContent zIndex="100">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Pick a badge to display!</PopoverHeader>
            <PopoverBody>
              <Grid templateColumns="repeat(5, 1fr)" gap="1px" width="fit-content" alignItems="center">  
                {badgesAlphabetical.map((badge) => (
                  <Badge badge={badge} disabled={badge.displayed ? true : false} onClick={() => {
                    setBadgeDisplayed({ id: badge.id, displayed: true, order: displayedBadges.length })
                  }}></Badge>
                ))}
                <Badge badge={null} disabled={true} onClick={() => {
                    setBadgeDisplayed({ id: displayedBadge.id, displayed: false, order: displayedBadges.length })
                }}></Badge>
              </Grid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        }
        
      </Grid>
    </FormControl>
  );
}

Badges.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
Badges.provides = 'badges';

export default Badges;