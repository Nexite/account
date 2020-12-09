import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import merge from 'deepmerge';
import Box from '@codeday/topo/Atom/Box';
import getPropertyComponents from './ProfileProperty';

const ProfileBlocks = ({ user, query, fields, onChange }) => {
  const [components, setComponents] = useState([]);
  const [_, dispatchChange] = useReducer((state, change) => {
    let merged = merge(state, change);
    if (change.query) {
      if (change.query.badges) {
        merged.query.badges = change.query.badges
      }
    }
    onChange(merged);
    return merged;
  }, {});

  useEffect(() => {
    setComponents(getPropertyComponents(fields)
      .map((component) => {
        const result = { _: {} };
        return {
          result,
          element: (
            <Box paddingBottom="2" key={Array.isArray(component.provides) ? component.provides[0] : component.provides}>
              {
                React.createElement(component, {
                  user,
                  query,
                  onChange: dispatchChange,
                })
              }
            </Box>
          ),
        };
      }));
  }, [user, JSON.stringify(fields)]);

  return components.map((obj) => obj.element);
};
ProfileBlocks.propTypes = {
  user: PropTypes.object,
  query: PropTypes.object,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
};
ProfileBlocks.defaultProps = {
  user: { user_metadata: {} },
  onChange: () => {},
};

export default React.memo(ProfileBlocks);
