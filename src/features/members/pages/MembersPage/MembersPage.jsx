import MemberTable from '@features/members/components/MemberTable/index.js';

export default function MembersPage({ onSelect }) {
  return <MemberTable onSelect={onSelect} />;
}
