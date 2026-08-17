import {
  Alert,
  AlertAction,
  AlertActions,
  AlertBody,
  AlertClose,
  AlertDescription,
  AlertIcon,
  AlertRow,
  AlertTitle,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function AlertPreview() {
  return (
    <Looks>
      <Look align="stretch">
        <Alert variant="info" className="w-full">
          <AlertRow>
            <AlertIcon />
            <AlertBody>
              <AlertTitle>New version available</AlertTitle>
              <AlertDescription>
                Update to get the latest components and Foundation tokens.
              </AlertDescription>
            </AlertBody>
            <AlertClose type="button" />
          </AlertRow>
          <AlertActions>
            <AlertAction type="button">Update</AlertAction>
          </AlertActions>
        </Alert>
      </Look>
    </Looks>
  );
}
