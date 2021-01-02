import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'react-bootstrap';
import {
  BUG_CREATE_PAGE,
  BUG_EDIT_PAGE,
  DASHBOARD_PAGE,
  USER_PROFILE_EDIT_PAGE,
  USER_LIST_PAGE,
  USER_EDIT_PAGE,
  USER_CREATE_PAGE,
  PROJECT_LIST_PAGE,
  PROJECT_EDIT_PAGE,
  PROJECT_CREATE_PAGE,
} from '../constants/screenConstants';

const ToastMessage = ({ curr_page, lg_user }) => {
  const [projManager, setProjManager] = useState('');

  const bugDetails = useSelector((state) => state.bugDetails);
  const { bug } = bugDetails;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  useEffect(() => {
    if (bug.project) {
      setProjManager(bug.project.managerAssigned.name);
    }
  }, [bug, user]);

  switch (curr_page) {
    case DASHBOARD_PAGE:
      return (
        <>
          {lg_user.isAdmin ? (
            <p>
              From the navigation bar, select "Profile" to edit your user
              profile. Select "Manager Users" to create/edit/delete users.
              Select "Manager Projects" to create/edit/delete projects.
            </p>
          ) : (
            <p>
              Select "Profile" from navigation bar to edit your user profile.
            </p>
          )}

          <p>
            Click the <Badge variant="primary">New Issue</Badge> button on this
            page to create a new bug report, .
          </p>
          {lg_user.isAdmin && (
            <p>
              Click the delete icon <i className="fas fa-trash fh" /> to delete
              a bug report from bug report list.
            </p>
          )}
          <p>
            Click the report icon <i className="fas fa-list-ul fs"></i> at the
            end of a table row to edit and track progress on a bug report.
          </p>
        </>
      );

    case BUG_CREATE_PAGE:
      return (
        <>
          <p>
            Fill in all required information on this page to create a new bug
            report.
          </p>
          {lg_user.isManager ? (
            <p>
              Your manager status allows you to appoint an Assignee for the new
              bug.
            </p>
          ) : (
            <p>
              You need to login as an manager to appoint Assignee for the bug.
            </p>
          )}
        </>
      );

    case BUG_EDIT_PAGE:
      return (
        <>
          {bug.resolvedAt ? (
            <p>
              This bug is already resolved. There is no more editting allowed on
              this bug report.
            </p>
          ) : (
            <>
              <p>
                You can edit bug report and make comments. All bug report
                changes and comments are tracked under "Tracker Logs".
              </p>

              {projManager !== user.name ? (
                <p>
                  To change Assignee, you need to login as the manager of the
                  current project, <mark>{projManager}</mark>.
                </p>
              ) : (
                <p>
                  You are the manager of the current project. You have the
                  authorization to change the Assignee for this task.
                </p>
              )}

              <p>
                Click the <Badge variant="success">Resolved </Badge> button at
                the bottom of the screen to set the bug report status to
                "CLOSE".
              </p>
            </>
          )}
        </>
      );

    case USER_PROFILE_EDIT_PAGE:
      return (
        <>
          <p>
            Update your name, email, password and profile photo on this page.
          </p>
        </>
      );

    case USER_LIST_PAGE:
      return (
        <>
          <p>
            Click the <Badge variant="primary">New User</Badge> button to add a
            new user.
          </p>
          <p>
            Click the edit icon <i className="fas fa-edit"></i> to edit a user
            profile.
          </p>
          <p>
            Click the delete icon <i className="fas fa-trash fh" /> to delete a
            user from user list.{' '}
            <em>
              (Note: the master admin user cannot be editted by others or
              deleted. )
            </em>
          </p>
        </>
      );

    case USER_EDIT_PAGE:
      return (
        <>
          <p>You can update user profile information on this page.</p>
          {user.email !== 'admin@example.com' ? (
            <p>
              By designating user as "manager" or "admin", the user is given
              authorization for those duties. New user status will be reflected
              on the user list page.
            </p>
          ) : (
            <p>
              Master admin's name, email and admin status cannot be changed.
            </p>
          )}
        </>
      );

    case USER_CREATE_PAGE:
      return (
        <>
          <p>Fill in all required user information to add a new user.</p>
        </>
      );

    case PROJECT_LIST_PAGE:
      return (
        <>
          <p>
            Click the <Badge variant="primary">New Project</Badge> button to add
            a new project.
          </p>
          <p>
            Click the edit icon <i className="fas fa-edit"></i> to edit a
            project details.
          </p>
          <p>
            Click the delete icon <i className="fas fa-trash fh" /> to delete a
            project from project list.
          </p>
        </>
      );

    case PROJECT_EDIT_PAGE:
      return (
        <>
          <p>You can update project details on this page.</p>
        </>
      );

    case PROJECT_CREATE_PAGE:
      return (
        <>
          <p>Fill in all required project information to add a new project.</p>
        </>
      );

    default:
      return '';
  }
};

export default ToastMessage;
