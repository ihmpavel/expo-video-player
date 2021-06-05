import { jsx as _jsx } from "react/jsx-runtime";
import { ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
const ICON_COLOR = '#FFF';
const CENTER_ICON_SIZE = 36;
const BOTTOM_BAR_ICON_SIZE = 30;
const style = StyleSheet.create({
    iconStyle: {
        textAlign: 'center',
    },
});
export const PlayIcon = () => (_jsx(MaterialIcons, { name: 'play-arrow', size: CENTER_ICON_SIZE, color: ICON_COLOR, style: style.iconStyle }, void 0));
export const PauseIcon = () => (_jsx(MaterialIcons, { name: 'pause', size: CENTER_ICON_SIZE, color: ICON_COLOR, style: style.iconStyle }, void 0));
export const Spinner = () => _jsx(ActivityIndicator, { color: ICON_COLOR, size: 'large' }, void 0);
export const FullscreenEnterIcon = () => (_jsx(MaterialIcons, { name: 'fullscreen', size: BOTTOM_BAR_ICON_SIZE, color: ICON_COLOR, style: style.iconStyle }, void 0));
export const FullscreenExitIcon = () => (_jsx(MaterialIcons, { name: 'fullscreen-exit', size: BOTTOM_BAR_ICON_SIZE, color: ICON_COLOR, style: style.iconStyle }, void 0));
export const ReplayIcon = () => (_jsx(MaterialIcons, { name: 'replay', size: CENTER_ICON_SIZE, color: ICON_COLOR, style: style.iconStyle }, void 0));
