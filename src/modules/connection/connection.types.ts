import { ConnectionConstantsCollection } from './connection.constant.ts';
import type { ConnectionFieldsType } from './connection.model.ts';

type CreateConnectionAllowedStatusType =
  (typeof ConnectionConstantsCollection.CreateConnectionAllowedStatus)[number];

type UpdateConnectionAllowedStatusType =
  (typeof ConnectionConstantsCollection.UpdateConnectionAllowedStatus)[number];

type ConnectionListType =
  `${(typeof ConnectionConstantsCollection.CONNECTION_LIST)[keyof typeof ConnectionConstantsCollection.CONNECTION_LIST]}`;

type ConnectionStatusType =
  `${(typeof ConnectionConstantsCollection.CONNECTION_STATUS_ENUM)[keyof typeof ConnectionConstantsCollection.CONNECTION_STATUS_ENUM]}`;

export interface ConnectionTypeCollection {
  ConnectionFieldsType: ConnectionFieldsType;
  CreateConnectionAllowedStatusType: CreateConnectionAllowedStatusType;
  UpdateConnectionAllowedStatusType: UpdateConnectionAllowedStatusType;
  ConnectionListType: ConnectionListType;
  ConnectionStatusType: ConnectionStatusType;
}
