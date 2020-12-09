import React, { useState } from 'react';
import PropTypes from 'prop-types';
import merge from 'deepmerge';
import Button from '@codeday/topo/Atom/Button';
import { useToasts } from '@codeday/topo/utils';
import { updateUserProfile } from '../utils/profile';
import { tryAuthenticatedApiQuery } from '../utils/api';
import { EditDisplayedBadgesMutation } from '../utils/profile.gql';

const hasRequired = (required, user, request) => {
  const merged = merge(user, request);
  const missing = required
    .map((str) => {
      try {
        return str.split('.').reduce((o, i) => o[i], merged) || false;
      } catch (ex) {
        return false;
      }
    });
  return missing.filter((res) => !res).length === 0;
};

const SubmitUpdates = ({
  required, user, request, token, onError, onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { error } = useToasts();
  return (
    <Button
      variantColor="green"
      isDisabled={!request || Object.keys(request).length === 0 || !hasRequired(required, user, request)}
      isLoading={isLoading}
      onClick={async () => {
        if (isLoading) return;
        setIsLoading(true);
        if (request.user) {
          try {
            await updateUserProfile(request, token);
          } catch (err) {
            if (err.response.data && err.response.data.error) error(err.response.data.error);
          }
        }
        if (request.query) {
          await tryAuthenticatedApiQuery(EditDisplayedBadgesMutation, {username: request.query.username, badges: request.query.badges}, "put jwt token here")
        }
        onSubmit();

        setIsLoading(false);
      }}
    >
      Update Profile
    </Button>
  );
};
SubmitUpdates.propTypes = {
  required: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired,
  token: PropTypes.string,
  onError: PropTypes.func,
  onSubmit: PropTypes.func,
};
SubmitUpdates.defaultProps = {
  required: [],
  token: null,
  onError: () => {},
  onSubmit: () => {},
};
export default SubmitUpdates;
