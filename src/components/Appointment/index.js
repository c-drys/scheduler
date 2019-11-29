import React from "react";

import "components/Appointment/styles.scss";

import Empty from "components/Appointment/empty";
import Header from "components/Appointment/header";
import Show from "components/Appointment/show";
import Form from "components/Appointment/form";
import Status from "components/Appointment/status";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  function save(name, interviewer) {
    transition(SAVE);
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview).then(response => {
      transition(SHOW);
    });
  }

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVE = "SAVE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

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
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVE && <Status />}
    </article>
  );
}
