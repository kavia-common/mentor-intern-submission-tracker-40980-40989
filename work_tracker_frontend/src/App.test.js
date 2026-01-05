import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Digital Bootcamp header", () => {
  render(<App />);
  const title = screen.getByText(/Digital Bootcamp/i);
  expect(title).toBeInTheDocument();
});
