/* @flow */

import React from 'react';

// @todo when we split types into common, native and web,
// we can properly change Animated.Value to its real value
type AnimatedValue = *;

export type HeaderMode = 'float' | 'screen' | 'none';

export type HeaderProps = NavigationSceneRendererProps & {
  mode: HeaderMode,
  router: NavigationRouter<NavigationState, NavigationAction, NavigationStackScreenOptions>,
  getScreenDetails: (
    NavigationScene,
  ) => NavigationScreenDetails<NavigationStackScreenOptions>,
};

/**
 * NavigationState is a tree of routes for a single navigator, where each child
 * route may either be a NavigationScreenRoute or a NavigationRouterRoute.
 * NavigationScreenRoute represents a leaf screen, while the
 * NavigationRouterRoute represents the state of a child navigator.
 *
 * NOTE: NavigationState is a state tree local to a single navigator and
 * its child navigators (via the routes field).
 * If we're in navigator nested deep inside the app, the state will only be the
 * state for that navigator.
 * The state for the root navigator of our app represents the whole navigation
 * state for the whole app.
 */
export type NavigationState = {
  /**
   * Index refers to the active child route in the routes array.
   */
  index: number,
  routes: Array<NavigationRoute>,
};

export type NavigationRoute = NavigationLeafRoute | NavigationStateRoute;

export type NavigationLeafRoute = {
  /**
   * React's key used by some navigators. No need to specify these manually,
   * they will be defined by the router.
   */
  key: string,
  /**
   * For example 'Home'.
   * This is used as a key in a route config when creating a navigator.
   */
  routeName: string,
  /**
   * Path is an advanced feature used for deep linking and on the web.
   */
  path?: string,
  /**
   * Params passed to this route when navigating to it,
   * e.g. `{ car_id: 123 }` in a route that displays a car.
   */
  params?: NavigationParams,
};

export type NavigationStateRoute = NavigationLeafRoute & {
  index: number,
  routes: Array<NavigationRoute>,
};

export type NavigationScreenOptionsGetter<Options, Action> = (
  navigation: NavigationScreenProp<NavigationRoute, Action>,
  screenProps?: {},
) => Options;

export type NavigationRouter<State, Action, Options> = {
  /**
   * The reducer that outputs the new navigation state for a given action, with
   * an optional previous state. When the action is considered handled but the
   * state is unchanged, the output state is null.
   */
  getStateForAction: (action: Action, lastState: ?State) => ?State,

  /**
   * Maps a URI-like string to an action. This can be mapped to a state
   * using `getStateForAction`.
   */
  getActionForPathAndParams: (
    path: string,
    params?: NavigationParams,
  ) => ?Action,

  getPathAndParamsForState: (state: State) => {
    path: string,
    params?: NavigationParams,
  },

  getComponentForRouteName: (routeName: string) => NavigationComponent,

  getComponentForState: (state: State) => NavigationComponent,

  /**
   * Gets the screen navigation options for a given screen.
   *
   * For example, we could get the config for the 'Foo' screen when the
   * `navigation.state` is:
   *
   *  {routeName: 'Foo', key: '123'}
   */
  getScreenOptions: NavigationScreenOptionsGetter<Options, Action>,
};

export type NavigationScreenOption<T> =
  | T
  | ((
    navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
    config: T,
  ) => T);

export type Style =
  | { [key: string]: any }
  | number
  | false
  | null
  | void
  | Array<Style>;

export type NavigationScreenDetails<T> = {
  options: T,
  state: NavigationRoute,
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
};

export type NavigationScreenOptions = {
  title?: string,
};

export type NavigationScreenConfigProps = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
  screenProps: Object,
};

export type NavigationScreenConfig<Options> =
  | Options
  | (NavigationScreenConfigProps & ((
    {
      navigationOptions: NavigationScreenProp<NavigationRoute, NavigationAction>,
    },
  ) => Options));

export type NavigationComponent =
  | NavigationScreenComponent<*, *>
  | NavigationNavigator<*, *, *, *>;

export type NavigationScreenComponent<T, Options> = ReactClass<T> & {
  navigationOptions?: NavigationScreenConfig<Options>,
};

export type NavigationNavigator<T, State, Action, Options> = ReactClass<T> & {
  router?: NavigationRouter<State, Action, Options>,
  navigationOptions?: NavigationScreenConfig<Options>,
};

export type NavigationParams = {
  [key: string]: string,
};

export type NavigationNavigateAction = {
  type: 'Navigation/NAVIGATE',
  routeName: string,
  params?: NavigationParams,

  // The action to run inside the sub-router
  action?: NavigationNavigateAction,
};

export type NavigationBackAction = {
  type: 'Navigation/BACK',
  key?: ?string,
};

export type NavigationSetParamsAction = {
  type: 'Navigation/SET_PARAMS',

  // The key of the route where the params should be set
  key: string,

  // The new params to merge into the existing route params
  params?: NavigationParams,
};

export type NavigationInitAction = {
  type: 'Navigation/INIT',
  params?: NavigationParams,
};

export type NavigationResetAction = {
  type: 'Navigation/RESET',
  index: number,
  key?: ?string,
  actions: Array<NavigationNavigateAction>,
};

export type NavigationUriAction = {
  type: 'Navigation/URI',
  uri: string,
};

export type NavigationStackViewConfig = {
  mode?: 'card' | 'modal',
  headerMode?: HeaderMode,
  cardStyle?: Style,
  transitionConfig?: () => TransitionConfig,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
};

export type NavigationStackScreenOptions = NavigationScreenOptions & {
  header?: ?(React.Element<*> | ((HeaderProps) => React.Element<*>)),
  headerTitle?: string | React.Element<*>,
  headerTitleStyle?: Style,
  headerTintColor?: string,
  headerLeft?: React.Element<*>,
  headerBackTitle?: string,
  headerTruncatedBackTitle?: string,
  headerBackTitleStyle?: Style,
  headerPressColorAndroid?: string,
  headerRight?: React.Element<*>,
  headerStyle?: Style,
  gesturesEnabled?: boolean,
};

export type NavigationStackRouterConfig = {
  initialRouteName?: string,
  initialRouteParams?: NavigationParams,
  paths?: NavigationPathsConfig,
  navigationOptions?: NavigationScreenConfig<NavigationStackScreenOptions>,
};

export type NavigationStackAction =
  | NavigationInitAction
  | NavigationNavigateAction
  | NavigationBackAction
  | NavigationSetParamsAction
  | NavigationResetAction;

export type NavigationTabAction =
  | NavigationInitAction
  | NavigationNavigateAction
  | NavigationBackAction;

export type NavigationAction =
  | NavigationInitAction
  | NavigationStackAction
  | NavigationTabAction;

export type NavigationRouteConfig<T> = T & {
  navigationOptions?: NavigationScreenConfig<*>,
  path?: string,
};

export type NavigationScreenRouteConfig =
  | {
      screen: NavigationComponent,
    }
  | {
      getScreen: () => NavigationComponent,
    };

export type NavigationPathsConfig = {
  [routeName: string]: string,
};

export type NavigationTabRouterConfig = {
  initialRouteName?: string,
  paths?: NavigationPathsConfig,
  navigationOptions?: NavigationScreenConfig<NavigationTabScreenOptions>,
  order?: Array<string>, // todo: type these as the real route names rather than 'string'

  // Does the back button cause the router to switch to the initial tab
  backBehavior?: 'none' | 'initialRoute', // defaults `initialRoute`
};

export type NavigationTabScreenOptions = NavigationScreenOptions & {
  tabBarIcon?:
    | React.Element<*>
    | ((
      options: { tintColor: ?string, focused: boolean },
    ) => ?React.Element<*>),
  tabBarLabel?:
    | string
    | React.Element<*>
    | ((
      options: { tintColor: ?string, focused: boolean },
    ) => ?React.Element<*>),
  tabBarVisible?: boolean,
};

export type NavigationDrawerScreenOptions = NavigationScreenOptions & {
  drawerIcon?:
    | React.Element<*>
    | ((
      options: { tintColor: ?string, focused: boolean },
    ) => ?React.Element<*>),
  drawerLabel?:
    | React.Element<*>
    | ((
      options: { tintColor: ?string, focused: boolean },
    ) => ?React.Element<*>),
  drawerLockMode?: 'unlocked' | 'locked-close' | 'locked-open', // defaults `unlocked`
};

export type NavigationRouteConfigMap = {
  [routeName: string]: NavigationRouteConfig<*>,
};

export type NavigationDispatch<A> = (action: A) => boolean;

export type NavigationProp<S, A> = {
  state: S,
  dispatch: NavigationDispatch<A>,
};

export type NavigationScreenProp<S, A> = {
  state: S,
  dispatch: NavigationDispatch<A>,
  goBack: (routeKey?: ?string) => boolean,
  navigate: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationAction,
  ) => boolean,
  setParams: (newParams: NavigationParams) => boolean,
};

export type NavigationNavigatorProps<T> = {
  navigation: NavigationProp<T, NavigationAction>,
  screenProps: *,
  navigationOptions: *,
};

/**
 * Gestures, Animations, and Interpolators
 */

export type NavigationGestureDirection = 'horizontal' | 'vertical';

export type NavigationLayout = {
  height: AnimatedValue,
  initHeight: number,
  initWidth: number,
  isMeasured: boolean,
  width: AnimatedValue,
};

export type NavigationScene = {
  index: number,
  isActive: boolean,
  isStale: boolean,
  key: string,
  route: NavigationRoute,
};

export type NavigationTransitionProps = {
  // The layout of the screen container
  layout: NavigationLayout,

  // The destination navigation state of the transition
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,

  // The progressive index of the transitioner's navigation state.
  position: AnimatedValue,

  // The value that represents the progress of the transition when navigation
  // state changes from one to another. Its numberic value will range from 0
  // to 1.
  //  progress.__getAnimatedValue() < 1 : transtion is happening.
  //  progress.__getAnimatedValue() == 1 : transtion completes.
  progress: AnimatedValue,

  // All the scenes of the transitioner.
  scenes: Array<NavigationScene>,

  // The active scene, corresponding to the route at
  // `navigation.state.routes[navigation.state.index]`. When rendering
  // NavigationSceneRendererPropsIndex, the scene does not refer to the active
  // scene, but instead the scene that is being rendered. The index always
  // is the index of the scene
  scene: NavigationScene,
  index: number,

  screenProps?: {},
};

// The scene renderer props are nearly identical to the props used for rendering
// a transition. The exception is that the passed scene is not the active scene
// but is instead the scene that the renderer should render content for.
export type NavigationSceneRendererProps = NavigationTransitionProps;

export type NavigationTransitionSpec = {
  duration?: number,
  // An easing function from `Easing`.
  easing?: () => any,
  // A timing function such as `Animated.timing`.
  timing?: (value: AnimatedValue, config: any) => any,
};

/**
 * Describes a visual transition from one screen to another.
 */
export type TransitionConfig = {
  // The basics properties of the animation, such as duration and easing
  transitionSpec?: NavigationTransitionSpec,
  // How to animate position and opacity of the screen
  // based on the value generated by the transitionSpec
  screenInterpolator?: (props: NavigationSceneRendererProps) => Object,
};

export type NavigationAnimationSetter = (
  position: AnimatedValue,
  newState: NavigationState,
  lastState: NavigationState,
) => void;

export type NavigationSceneRenderer = () => ?React.Element<*>;

export type NavigationStyleInterpolator = (
  props: NavigationSceneRendererProps,
) => Style;

export type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
};
