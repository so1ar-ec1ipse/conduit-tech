import api from "../../utils/api";
import { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Link,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { FINAL_FIELD_NAME } from "../../utils/constants";

export default function HomePage() {
  const [step, setStep] = useState(null);
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    onNext();
  }, []);

  const convertOptionsArrayToObject = (optionsArray) => {
    return optionsArray.reduce(
      (tot, option) => ({ ...tot, [option.key]: option.value }),
      {}
    );
  };

  const onNext = () => {
    const newOptions = [...selectedOptions];
    if (step) {
      newOptions.push({ key: step, value: currentOption, options });
      setSelectedOptions(newOptions);
    }

    api()
      .get("/constructions/form-next-step", {
        params: {
          currentField: step,
          selectedOptions: convertOptionsArrayToObject(newOptions),
        },
      })
      .then(({ data }) => {
        const { name, options: availableOptions } = data;

        setStep(name);
        setCurrentOption("");
        setOptions(availableOptions);
      })
      .catch((err) => console.warn(err));
  };

  const onPrev = () => {
    goToStep(selectedOptions.length - 1);
  };

  const onOptionChange = (e) => {
    setCurrentOption(e.target.value);
  };

  const goToStep = (index) => {
    setStep(selectedOptions[index]?.key ?? "");
    setCurrentOption(selectedOptions[index]?.value ?? "");
    setOptions(selectedOptions[index]?.options ?? []);
    setSelectedOptions([...selectedOptions.slice(0, index)]);
  };

  return (
    <>
      {step && (
        <>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {selectedOptions.map(({ key, value }, index) => (
              <Link
                key={`${key}-${value}`}
                onClick={() => goToStep(index)}
                className=""
              >
                {key}
              </Link>
            ))}
            <div>{step}</div>
          </Breadcrumbs>
          <Box sx={{ width: 240, padding: 5 }}>
            {step === FINAL_FIELD_NAME ? (
              <Box
                sx={{
                  height: 56,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {options[0]}
              </Box>
            ) : (
              <FormControl fullWidth>
                <InputLabel id="form-step">{step}</InputLabel>
                <Select
                  labelId="form-step"
                  id="form-step-select"
                  data-testid="form-step-select"
                  value={currentOption}
                  label={step}
                  onChange={onOptionChange}
                >
                  {options.map((option) => (
                    <MenuItem
                      key={`${step}-${option}`}
                      data-testid={`${step}-${option}`}
                      value={option}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </>
      )}
      <Button
        variant="contained"
        onClick={onPrev}
        color="inherit"
        disabled={!selectedOptions.length}
      >
        Prev
      </Button>
      {step !== FINAL_FIELD_NAME && (
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!currentOption}
          sx={{ marginLeft: 22 }}
        >
          Next
        </Button>
      )}
    </>
  );
}
