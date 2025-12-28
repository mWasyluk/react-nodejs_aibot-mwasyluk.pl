import { DarkMode, LightMode, Settings, Translate } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import styled, { useTheme } from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { LANGUAGE, THEME } from '../../state/constants';
import { isValidModelId } from '../../utils/model-util';

const ModelName = styled.div`
  font-size: 12px;
  font-weight: 700;
  opacity: 0.8;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Wrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const STATUS_ICON = {
  ok: "🟢",
  error: "🔴",
  missing: "⚫",
  requiresConfig: "🟠",
};

export default function TopRightBar() {
  const theme = useTheme();
  const { state, actions, selectors } = useAppState();

  const registry = selectors.selectModelsRegistry(state);
  const selectedModelId = selectors.selectSelectedModel(state)?.id;

  const selectModelStatus = (modelId) => selectors.selectModelStatus(state, modelId)
  const { t } = useI18n();

  const onChangeModel = (e) => {
    const modelId = e.target.value || null;
    actions.setSelectedModelId(modelId);
  };

  const toggleTheme = () =>
    actions.setTheme(state.ui.theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);

  const toggleLang = () =>
    actions.setLanguage(state.ui.language === LANGUAGE.PL ? LANGUAGE.EN : LANGUAGE.PL);

  return (
    <Wrap className="topRightBar">
      <ModelName>
        <select
          value={selectedModelId ?? ""}
          onChange={onChangeModel}
          className="topRightBar__modelSelect"
          aria-label="Model"
        >
          {!isValidModelId(selectedModelId) && <option value="">Select model</option>}

          {registry.map((m) => {
            const status = selectModelStatus(m.id) ?? "missing";
            const icon = STATUS_ICON[status] ?? "⚫";

            const disabled = status === "missing" || status === "requiresConfig";

            return (
              <option key={m.id} value={m.id} disabled={disabled}>
                {icon} {m.title ?? m.name ?? m.id}
              </option>
            );
          })}
        </select>
      </ModelName>

      <Tooltip title={t.topbarThemeTooltip}>
        <IconButton onClick={toggleTheme} sx={{ color: theme.colors.text.primary }}>
          {state.ui.theme === THEME.DARK ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>

      <Tooltip title={`${t.topbarLanguageTooltip}: ${state.ui.language.toUpperCase()}`}>
        <IconButton onClick={toggleLang} sx={{ color: theme.colors.text.primary }}>
          <Translate />
        </IconButton>
      </Tooltip>

      <Tooltip title={t.topbarSettingsTooltip}>
        <span>
          <IconButton disabled sx={{ color: theme.colors.text.primary }}>
            <Settings />
          </IconButton>
        </span>
      </Tooltip>
    </Wrap>
  );
}
