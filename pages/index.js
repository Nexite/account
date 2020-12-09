import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import merge from 'deepmerge';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import WavingHand from '@codeday/topocons/Emoji/People/WavingHand';
import SubmitUpdates from '../components/SubmitUpdates';
import Page from '../components/Page';
import ProfileBlocks from '../components/ProfileBlocks';
import loginApi from '../lib/login';
import refreshUser from '../utils/refresh-user';
import { getSites } from '../utils/contentful';
import { IndexQuery } from './index.gql';
import { apiFetch } from '@codeday/topo/utils';
import { print } from 'graphql';

export const getServerSideProps = async ({ req, res }) => {
  const session = await loginApi.getSession(req);
  
  if (!session || !session.user) {
    res.writeHead(302, {
      Location: '/api/login',
    });
    res.end();
    return { props: {} };
  }
  const user = await refreshUser(session.user.sub);
  var query = await apiFetch(print(IndexQuery), {username: user.username})
  return {
    props: {
      user,
      query,
      sites: await getSites([
        'Student',
        (user.roles.volunteer || user.roles.staff) && 'Volunteer',
        user.roles.employee && 'Employee',
        user.roles.devops && 'Devops',
      ]),
    },
  };
};

const User = ({ user, query, sites }) => {
  const [request, setRequest] = useState({});
  return (
    <>
    <Page isLoggedIn>
      <Head>
        <title>CodeDay Account</title>
      </Head>
      <Text>
        <WavingHand /> Welcome back,&nbsp;
        <Text bold as="span">
          {user.given_name}
          {' '}
          <Box
            as="span"
            borderRadius={4}
            paddingLeft={1}
            paddingRight={1}
            d={(user.roles.volunteer || user.roles.staff || user.roles.employee) ? 'inline-block' : 'none'}
            fontSize="xs"
            fontWeight="bold"
            backgroundColor={((user.roles.employee || user.roles.staff) && 'red.600') || 'blue.500'}
            color="white"
            position="relative"
            top="-2px"
          >
            {
              (user.roles.employee && 'Employee')
              || (user.roles.staff && 'Staff')
              || (user.roles.volunteer && 'Volunteer')
            }
          </Box>
        </Text>, here are some things you can access
        with your CodeDay account:
      </Text>
      <Box paddingTop={4} paddingBottom={4}>
        {sites.map((site) => (
          <Button
            key={site.link}
            marginRight={3}
            marginBottom={3}
            as="a"
            variant="outline"
            href={site.link}
            target="_blank"
          >
            {site.title}
          </Button>
        ))}
      </Box>
      {/* <Divider /> */}
      <Heading as="h2" size="lg" paddingTop={4}>Update Your Account</Heading>
      <ProfileBlocks
        user={merge(user, request)}
        query={query}
        fields={[
          'username',
          'picture',
          'given_name',
          'family_name',
          'user_metadata.display_name_format',
          'badges',
          'user_metadata.pronoun',
          'user_metadata.phone_number',
          'user_metadata.bio',
          ...(user.roles.volunteer ? ['user_metadata.title'] : []),
          'roles.volunteer',
        ]}
        onChange={setRequest}
      />
      <Box textAlign="right">
        <SubmitUpdates
          required={['username', 'given_name', 'family_name', 'user_metadata.pronoun']}
          user={user}
          request={request}
        />
        <Box marginTop="3">
          <Button
            as="a"
            href="/api/password"
            size="xs"
            marginRight="3"
          >
            Change Password
          </Button>
          {user.enrollments.length > 0
            ? (
              <Button
                as="a"
                href="/api/no-mfa"
                size="xs"
              >
                Turn Off 2-Factor Auth
              </Button>
            ) : (
              <Button
                as="a"
                href="/api/mfa"
                target="_blank"
                size="xs"
              >
                Add 2-Factor Auth
              </Button>
            )}
        </Box>
      </Box>
    </Page>
    </>
  );
};
User.propTypes = {
  user: PropTypes.object.isRequired,
  sites: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default User;
