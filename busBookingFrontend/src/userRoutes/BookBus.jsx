import { useState } from "react";
import {
  Heading,
  Panel,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
} from "rsuite";
import Notification from "../components/Notification";

const BookBus = () => {
  const [formValue, setFormValue] = useState({
    from: "",
    to: "",
    date: null,
    seats: 1,
    busName: "",
  });

  const [message, setMessage] = useState("");

  const handleBook = () => {
    // Validation
    if (!formValue.from || !formValue.to || !formValue.date) {
      setMessage("Please fill From, To and Date");
      return;
    }

    // Here you’d call API
    setMessage("Bus booked successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <Heading level={2} style={{ marginBottom: 16 }}>
        Book a Bus
      </Heading>

      <Panel bordered shaded>
        <Form fluid formValue={formValue} onChange={setFormValue}>
          <Form.Group controlId="from">
            <Form.ControlLabel>From</Form.ControlLabel>
            <Form.Control name="from" accepter={Input} />
          </Form.Group>

          <Form.Group controlId="to">
            <Form.ControlLabel>To</Form.ControlLabel>
            <Form.Control name="to" accepter={Input} />
          </Form.Group>

          <Form.Group controlId="date">
            <Form.ControlLabel>Date</Form.ControlLabel>
            <Form.Control name="date" accepter={DatePicker} oneTap />
          </Form.Group>

          <Form.Group controlId="seats">
            <Form.ControlLabel>Number of Seats</Form.ControlLabel>
            <Form.Control name="seats" accepter={InputNumber} min={1} />
          </Form.Group>

          <Form.Group controlId="busName">
            <Form.ControlLabel>Preferred Bus (optional)</Form.ControlLabel>
            <Form.Control name="busName" accepter={Input} />
          </Form.Group>

          <Button appearance="primary" onClick={handleBook}>
            Confirm Booking
          </Button>
        </Form>
      </Panel>

      <Notification show={!!message} type="success" message={message} />
    </>
  );
};

export default BookBus;
