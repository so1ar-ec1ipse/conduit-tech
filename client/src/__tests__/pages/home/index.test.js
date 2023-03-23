import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "../../../pages/home/index";
import api from "../../../utils/api";
import UserEvent from "@testing-library/user-event";

jest.mock("../../../utils/api");

const mockGet = jest.fn();

describe("HomePage", () => {
  beforeEach(() => {
    mockGet.mockReset();
    api.mockReturnValue({ get: mockGet });
  });

  test("renders the first step when component is mounted", async () => {
    const data = {
      name: "Ceiling type",
      options: [
        "Ceiling below roof joists",
        "Ceiling on exposed beams",
        "Ceiling under attic or attic knee wall",
      ],
    };
    mockGet.mockResolvedValueOnce({ data });

    render(<HomePage />);
    // Check if breadcrumb and select box are rendered correctly
    await waitFor(() => {
      expect(screen.getAllByText("Ceiling type").length).toBeGreaterThan(1);
    });
    expect((await screen.findAllByTestId("form-step-select")).length).toBe(1);

    // Open the select options
    const selectBox = (await screen.findAllByRole("button"))[0];
    UserEvent.click(selectBox);

    // Check if the select box contains all the options
    await waitFor(() => {
      for (const option of data.options)
        expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test("should work for switching between several steps", async () => {
    const data1 = {
      name: "Ceiling type",
      options: [
        "Ceiling below roof joists",
        "Ceiling on exposed beams",
        "Ceiling under attic or attic knee wall",
      ],
    };
    const data2 = {
      name: "Roofing material",
      options: [
        "Asphalt shingles",
        "Membrane",
        "Metal",
        "Tar and gravel",
        "Tile",
        "Wood shakes",
      ],
    };
    mockGet
      .mockResolvedValueOnce({ data: data1 })
      .mockResolvedValueOnce({ data: data2 });

    render(<HomePage />);
    await waitFor(async () =>
      expect((await screen.findAllByRole("button")).length).toBeGreaterThan(2)
    );

    let selectBox = (await screen.findAllByRole("button"))[0];
    let nextBtn = screen.getByText("Next");
    let prevBtn = screen.getByText("Prev");

    // Open select box
    UserEvent.click(selectBox);
    await waitFor(() => expect(nextBtn.disabled).toBe(true));
    expect(prevBtn.disabled).toBe(true);

    // Select one of the options in select box, and check if the next button is enabled
    let selectItem = screen.getByText("Ceiling below roof joists");
    UserEvent.click(selectItem);
    await waitFor(() => expect(nextBtn.disabled).toBe(false));

    // Click Next button, and check if the new breadcrumb and select box are updated correctly
    UserEvent.click(nextBtn);
    await waitFor(() =>
      expect(screen.getAllByText("Roofing material").length).toBeGreaterThan(1)
    );
    expect(nextBtn.disabled).toBe(true);
    // Breadcrumb test
    expect(screen.getByText("Ceiling type")).toBeInTheDocument();

    // Open the new select box in the second step, and check if it contains all the options
    selectBox = (await screen.findAllByRole("button"))[0];
    UserEvent.click(selectBox);
    await waitFor(() => {
      for (const option of data2.options)
        expect(screen.getByText(option)).toBeInTheDocument();
    });
    // Check if the prev button is enabled correctly
    expect(prevBtn.disabled).toBe(false);

    // Click prev button, and check if the previously selected option is saved
    UserEvent.click(prevBtn);
    await waitFor(() =>
      expect(
        screen.getAllByText("Ceiling below roof joists").length
      ).toBeGreaterThan(1)
    );
  });

  test("renders final field when final step is reached", async () => {
    const data = {
      name: "Extended Construction Numbers",
      options: ["18A-0 ad"],
    };
    mockGet.mockResolvedValueOnce({ data });

    render(<HomePage />);
    await waitFor(() =>
      // Breadcrumb test
      expect(
        screen.getAllByText("Extended Construction Numbers").length
      ).toBeGreaterThan(0)
    );

    // Next button should not be existing on the page
    expect(screen.queryByText("Next")).toBeNull();
  });
});
