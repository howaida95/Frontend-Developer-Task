import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { membersService } from '@features/members/api';
import StatusBadge from '@shared/components/StatusBadge/index.js';
import Skeleton from '@shared/ui/Skeleton';
import EyeIcon from '@/assets/icons/eye.svg?react';
import EyeSlashIcon from '@/assets/icons/eye-slash.svg?react';
import { t } from '@shared/i18n';
import { date, number } from '@shared/utils/format';
import { Button, Modal } from '@shared/ui';
import styles from './MemberDetail.module.scss';

function MemberDetail({ id, onClose }) {
  const lang = useSelector((state) => state.language.value);
  const [member, setMember] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfidential, setShowConfidential] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [memberResponse, sessionsResponse] = await Promise.all([
          membersService.getMember({ id, signal: controller.signal }),
          membersService.getSessions({ id, signal: controller.signal }),
        ]);
        setMember(memberResponse.data);
        setSessions(sessionsResponse.data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [id]);

  const handleClose = useCallback(() => onClose(), [onClose]);
  return (
    <Modal
      open={Boolean(id)}
      onClose={handleClose}
      title={member?.name?.[lang] || t('memberDetails', lang)}
      labelledBy="detail-title"
      placement="center"
      className={styles.modal}
    >
      {loading ? (
        <MemberDetailSkeleton />
      ) : error ? (
        <div className={styles.drawerLoading}>
          <p>{t('memberDetailsError', lang)}</p>
          <Button variant="secondary" onClick={handleClose}>
            {t('close', lang)}
          </Button>
        </div>
      ) : (
        <>
          <header className={styles.drawerHeader}>
            <div className={styles.memberCell}>
              <div className={styles.avatar}>{member.name[lang].slice(0, 1)}</div>
              <div>
                <span>{member.memberNumber}</span>
              </div>
            </div>
          </header>
          <div className={styles.progressCard}>
            <span className={styles.statLabel}>{t('monthlyProgress', lang)}</span>
            <div className={styles.progressTop}>
              <strong>{number(member.sessionsThisMonth, lang)}</strong>
              <span>
                {t('sessionCount', lang, {
                  done: number(member.sessionsThisMonth, lang),
                  goal: number(member.monthlyGoal, lang),
                })}
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${Math.min(100, (member.sessionsThisMonth / member.monthlyGoal) * 100)}%`,
                }}
              />
            </div>
          </div>
          <section className={styles.detailSection}>
            <h3>{t('membership', lang)}</h3>
            <div className={styles.detailGrid}>
              <Info label={t('tier', lang)} value={t(member.tier, lang)} />
              <Info
                label={t('status', lang)}
                value={<StatusBadge value={member.status} lang={lang} />}
              />
              <Info label={t('joined', lang)} value={date(member.joinedAt, lang)} />
              <Info label={t('totalSessions', lang)} value={number(member.totalSessions, lang)} />
            </div>
          </section>
          <section className={styles.detailSection}>
            <div className={styles.confidentialHeader}>
              <div>
                <h3>{t('confidential', lang)}</h3>
                <p>{t('confidentialHint', lang)}</p>
              </div>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowConfidential((value) => !value)}
                aria-label={showConfidential ? t('hide', lang) : t('reveal', lang)}
              >
                {showConfidential ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </div>
            {showConfidential ? (
              <div className={styles.confidentialBox}>
                <Info label={t('phone', lang)} value={member.phone} />
                <Info
                  label={t('emergency', lang)}
                  value={`${member.emergencyContact.name} · ${member.emergencyContact.phone}`}
                />
                <Info label={t('medical', lang)} value={member.medicalNotes} />
              </div>
            ) : (
              <div className={styles.redacted} aria-label={t('confidential', lang)}>
                <span>••••••••</span>
                <span>••••••••</span>
                <span>••••••••</span>
              </div>
            )}
          </section>
          <section className={styles.detailSection}>
            <h3>{t('recentSessions', lang)}</h3>
            <div className={styles.sessionList}>
              {sessions.map((session) => (
                <div className={styles.sessionRow} key={session.id}>
                  <div>
                    <strong>{session.className[lang]}</strong>
                    <span>{session.coach}</span>
                  </div>
                  <div className={styles.sessionMeta}>
                    <span>{date(session.date, lang)}</span>
                    <span>
                      {number(session.durationMinutes, lang)} {t('min', lang)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </Modal>
  );
}
function MemberDetailSkeleton() {
  return (
    <div className={styles.detailSkeleton} aria-hidden="true">
      <div className={styles.drawerHeader}>
        <div className={styles.memberCell}>
          <Skeleton className={styles.skeletonAvatar} />
          <div>
            <Skeleton className={styles.skeletonMemberNumber} />
          </div>
        </div>
      </div>
      <div className={styles.progressCard}>
        <Skeleton className={styles.skeletonLabel} />
        <Skeleton className={styles.skeletonProgress} />
        <Skeleton className={styles.skeletonTrack} />
      </div>
      <section className={styles.detailSection}>
        <Skeleton className={styles.skeletonHeading} />
        <div className={styles.detailGrid}>
          {Array.from({ length: 4 }, (_, index) => (
            <div className={styles.info} key={index}>
              <Skeleton className={styles.skeletonLabel} />
              <Skeleton className={styles.skeletonValue} />
            </div>
          ))}
        </div>
      </section>
      <section className={styles.detailSection}>
        <Skeleton className={styles.skeletonHeading} />
        <Skeleton className={styles.skeletonBox} />
      </section>
      <section className={styles.detailSection}>
        <Skeleton className={styles.skeletonHeading} />
        {Array.from({ length: 4 }, (_, index) => (
          <div className={styles.sessionRowSkeleton} key={index}>
            <div>
              <Skeleton className={styles.skeletonValue} />
              <Skeleton className={styles.skeletonSmall} />
            </div>
            <div>
              <Skeleton className={styles.skeletonSmall} />
              <Skeleton className={styles.skeletonSmall} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
function Info({ label, value }) {
  return (
    <div className={styles.info}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
export default memo(MemberDetail);
