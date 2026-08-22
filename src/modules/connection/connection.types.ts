import { ConnectionConstantsCollection } from './connection.constant.ts';
import type { ConnectionFieldsType } from './connection.model.ts';

type CreateConnectionAllowedStatusType =
  (typeof ConnectionConstantsCollection.CreateConnectionAllowedStatus)[number];

type UpdateConnectionAllowedStatusType =
  (typeof ConnectionConstantsCollection.UpdateConnectionAllowedStatus)[number];

export interface ConnectionTypeCollection {
  ConnectionFieldsType: ConnectionFieldsType;
  CreateConnectionAllowedStatusType: CreateConnectionAllowedStatusType;
  UpdateConnectionAllowedStatusType: UpdateConnectionAllowedStatusType;
}
