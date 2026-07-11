import { useTranslation } from 'react-i18next';

export const PriorityCell = ({ value }: { value: string | undefined }) => {
    const { t } = useTranslation();

    if (!value) {
        return (
            <span className="text-muted-foreground">{t('common.notSet')}</span>
        );
    }

    return <span className="italic">{value}</span>;
};
