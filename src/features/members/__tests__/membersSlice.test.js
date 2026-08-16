import { describe, it, expect } from 'vitest';
import { membersReducer, fetchMembers } from '../membersSlice';

describe('members reducer', () => {
  it('accepts only the latest request response', () => {
    let state = membersReducer(undefined, { type: 'init' });
    state = membersReducer(state, {
      type: fetchMembers.pending.type,
      meta: { requestId: 'first' },
    });
    state = membersReducer(state, {
      type: fetchMembers.pending.type,
      meta: { requestId: 'second' },
    });
    const payload = { data: [{ id: 2 }], meta: { page: 1, per_page: 25, total: 1, last_page: 1 } };
    state = membersReducer(state, {
      type: fetchMembers.fulfilled.type,
      meta: { requestId: 'first' },
      payload: { data: [{ id: 1 }], meta: payload.meta },
    });
    expect(state.data).toEqual([]);
    state = membersReducer(state, {
      type: fetchMembers.fulfilled.type,
      meta: { requestId: 'second' },
      payload,
    });
    expect(state.data).toEqual([{ id: 2 }]);
  });
});
