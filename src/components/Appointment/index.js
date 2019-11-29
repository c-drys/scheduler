import React from "react";

import "components/Appointment/styles.scss";

import Empty from "components/Appointment/empty";
import Header from "components/Appointment/header";
import Show from "components/Appointment/show";
import Form from "components/Appointment/form";
import Status from "components/Appointment/status";
import Confirm from "components/Appointment/confirm";
import Error from "components/Appointment/error";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const EDITING = "EDITING";
  const DELETING = "DELETING";
  const CONFRIM = "CONFIRM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };

    props
      .bookInterview(props.id, interview)
      .then(response => {
        transition(SHOW);
      })
      .catch(error => {
        transition(ERROR_SAVE);
      });
  }

  function confirmation() {
    transition(CONFRIM);
  }

  function cancel() {
    transition(DELETING);

    props
      .cancelInterview(props.id)
      .then(response => {
        transition(EMPTY);
      })
      .catch(error => {
        transition(ERROR_DELETE);
      });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && (
        <Empty
          onAdd={() => {
            return transition(CREATE);
          }}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(confirmation)}
          onEdit={() => transition(EDITING)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === ERROR_SAVE && (
        <Error message="Error Saving appointment" onSave={() => back()} />
      )}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === ERROR_DELETE && (
        <Error message="Error deleting appointment" onDelete={() => back()} />
      )}
      {mode === CONFRIM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={() => back()}
          onConfirm={cancel}
        />
      )}
      {mode === EDITING && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={() => transition(SHOW)}
          onSave={save}
        />
      )}
    </article>
  );
}
