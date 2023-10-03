import PropTypes from 'prop-types';
import { Component } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import { Link, withRouter } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import NavigationPortal from 'flavours/glitch/components/navigation_portal';
import { Wordmark } from 'flavours/glitch/components/wordmark';
import { timelinePreview, trendsEnabled } from 'flavours/glitch/initial_state';
import { preferencesLink } from 'flavours/glitch/utils/backend_links';

import ColumnLink from './column_link';
import DisabledAccountBanner from './disabled_account_banner';
import FollowRequestsColumnLink from './follow_requests_column_link';
import ListPanel from './list_panel';
import NotificationsCounterIcon from './notifications_counter_icon';
import SignInBanner from './sign_in_banner';


const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  explore: { id: 'explore.title', defaultMessage: 'Explore' },
  firehose: { id: 'column.firehose', defaultMessage: 'Live feeds' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Private mentions' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favorites' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Lists' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  followsAndFollowers: { id: 'navigation_bar.follows_and_followers', defaultMessage: 'Follows and followers' },
  about: { id: 'navigation_bar.about', defaultMessage: 'About' },
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
  advancedInterface: { id: 'navigation_bar.advanced_interface', defaultMessage: 'Open in advanced web interface' },
  openedInClassicInterface: { id: 'navigation_bar.opened_in_classic_interface', defaultMessage: 'Posts, accounts, and other specific pages are opened by default in the classic web interface.' },
  app_settings: { id: 'navigation_bar.app_settings', defaultMessage: 'App settings' },
});

const mapStateToProps = (state) => ({
  server: state.getIn(['server', 'server']),
});

class NavigationPanel extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenSettings: PropTypes.func,
    server: ImmutablePropTypes.map,
  };

  isFirehoseActive = (match, location) => {
    return match || location.pathname.startsWith('/public');
  };

  render() {
    const { intl, onOpenSettings, server } = this.props;
    const { signedIn, disabledAccountId } = this.context.identity;

    return (
      <div className='navigation-panel'>
        <div className='navigation-panel__logo'>
          <Link to='/' className='column-link column-link--logo'>
            <Wordmark src={server.getIn(['wordmark', 'url'])} className='wordmark' />
            <Wordmark src={server.getIn(['wordmark_dark', 'url'])} className='wordmark_dark' />
          </Link>
          <hr />
        </div>

        {signedIn && (
          <>
            <ColumnLink transparent to='/home' icon='home' text={intl.formatMessage(messages.home)} />
            <ColumnLink transparent to='/notifications' icon={<NotificationsCounterIcon className='column-link__icon' />} text={intl.formatMessage(messages.notifications)} />
            <FollowRequestsColumnLink />
          </>
        )}

        {trendsEnabled ? (
          <ColumnLink transparent to='/explore' icon='hashtag' text={intl.formatMessage(messages.explore)} />
        ) : (
          <ColumnLink transparent to='/search' icon='search' text={intl.formatMessage(messages.search)} />
        )}

        {(signedIn || timelinePreview) && (
          <ColumnLink transparent to='/public/local' isActive={this.isFirehoseActive} icon='globe' text={intl.formatMessage(messages.firehose)} />
        )}

        {!signedIn && (
          <div className='navigation-panel__sign-in-banner'>
            <hr />
            { disabledAccountId ? <DisabledAccountBanner /> : <SignInBanner /> }
          </div>
        )}

        {signedIn && (
          <>
            <ColumnLink transparent to='/conversations' icon='at' text={intl.formatMessage(messages.direct)} />
            <ColumnLink transparent to='/bookmarks' icon='bookmark' text={intl.formatMessage(messages.bookmarks)} />
            <ColumnLink transparent to='/favourites' icon='star' text={intl.formatMessage(messages.favourites)} />
            <ColumnLink transparent to='/lists' icon='list-ul' text={intl.formatMessage(messages.lists)} />

            <ListPanel />

            <hr />

            {!!preferencesLink && <ColumnLink transparent href={preferencesLink} icon='cog' text={intl.formatMessage(messages.preferences)} />}
            <ColumnLink transparent onClick={onOpenSettings} icon='cogs' text={intl.formatMessage(messages.app_settings)} />
          </>
        )}

        <div className='navigation-panel__legal'>
          <hr />
          <ColumnLink transparent to='/about' icon='ellipsis-h' text={intl.formatMessage(messages.about)} />
        </div>

        <NavigationPortal />
      </div>
    );
  }

}

export default injectIntl(withRouter(connect(mapStateToProps)(NavigationPanel)));
