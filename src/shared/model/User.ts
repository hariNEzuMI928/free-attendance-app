import { Installation } from "@slack/bolt";

export const scopes = ["users.profile:write"];
export type Scopes = typeof scopes[number];

export default interface User {
  teamId: string;
  userId: string;
  token: string;
  scopes: Scopes[];
}

interface UserInstallation {
  id: string;
  token: string;
  scopes: string[];
}

export const buildPutUserParams = (installation: Installation): User => {
  const teamId = installation?.team?.id || "";
  const userId = installation?.user?.id || "";

  if (!teamId) throw new Error("Not support Org installation!");

  return {
    teamId,
    userId,
    token: installation?.user?.token || "",
    scopes: installation?.user?.scopes || [],
  };
};

export const buildUserInstallation = ({
  userId,
  token,
  scopes,
}: User): UserInstallation => {
  return { id: userId, token, scopes };
};
