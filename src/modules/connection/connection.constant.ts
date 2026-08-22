enum CONNECTION_STATUS_ENUM {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  INTERESTED = 'INTERESTED',
  IGNORED = 'IGNORED',
  BLOCKED = 'BLOCKED',
}

const CreateConnectionAllowedStatus = [
  CONNECTION_STATUS_ENUM.INTERESTED,
  CONNECTION_STATUS_ENUM.IGNORED,
];

const UpdateConnectionAllowedStatus = [
  CONNECTION_STATUS_ENUM.ACCEPTED,
  CONNECTION_STATUS_ENUM.REJECTED,
  CONNECTION_STATUS_ENUM.BLOCKED,
];

export const ConnectionConstantsCollection = {
  CONNECTION_STATUS_ENUM,
  CreateConnectionAllowedStatus,
  UpdateConnectionAllowedStatus,
};
