type JudgeResponse = {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  status: {
    id: number;
    description: string;
  };
};

type ExecutionResult = {
  output: string;
  error: string;
  status: string;
};

// Free public Judge0 instance — no API key or credit card needed
const JUDGE0_URL = "https://ce.judge0.com";

const safeAtob = (str?: string) => {
  if (!str) return "";
  try {
    return atob(str);
  } catch {
    return str;
  }
};

export const executeCode = async (
  sourceCode: string,
  languageId: number
): Promise<ExecutionResult> => {
  try {
    // Step 1: Submit the code
    const submitResponse = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=true`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source_code: btoa(unescape(encodeURIComponent(sourceCode))),
          language_id: languageId,
          stdin: "",
          cpu_time_limit: 5,
          memory_limit: 256000,
        }),
      }
    );

    if (!submitResponse.ok) {
      throw new Error(`Submission failed: ${submitResponse.status}`);
    }

    const { token } = await submitResponse.json();
    if (!token) throw new Error("No token received from Judge0");

    // Step 2: Poll for result (max 10 attempts, 1s apart)
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1000));

      const resultResponse = await fetch(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
        { headers: { "content-type": "application/json" } }
      );

      if (!resultResponse.ok) continue;

      const result: JudgeResponse = await resultResponse.json();

      // Status 1 = In Queue, 2 = Processing — keep polling
      if (result.status?.id <= 2) continue;

      // Status 3 = Accepted (success)
      if (result.status?.id === 3) {
        return {
          output: safeAtob(result.stdout) || "(no output)",
          error: "",
          status: "Success",
        };
      }

      // Status 4+ = various error states
      return {
        output: "",
        error:
          safeAtob(result.stderr) ||
          safeAtob(result.compile_output) ||
          result.message ||
          result.status.description,
        status: result.status.description,
      };
    }

    return {
      output: "",
      error: "Execution timed out. Please try again.",
      status: "Timeout",
    };
  } catch (error) {
    console.error("Code execution error:", error);
    return {
      output: "",
      error: `Execution Error: ${(error as Error).message}`,
      status: "Error",
    };
  }
};
