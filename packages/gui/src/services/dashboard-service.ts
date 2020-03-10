import m, { ComponentTypes, RouteDefs } from 'mithril';
import { EditForm } from '../components/edit/edit-form';
import { Layout } from '../components/layout';
import { EditSettings } from '../components/settings/edit-settings';
import { IDashboard } from '../models/dashboard';
import { actions, states } from './';

export const enum Dashboards {
  HOME = 'HOME',
  SETTINGS = 'SETTINGS',
}

class DashboardService {
  private actions = actions;
  private states = states;
  private dashboards!: ReadonlyArray<IDashboard>;

  constructor(private layout: ComponentTypes, dashboards: IDashboard[]) {
    this.setList(dashboards);
  }

  public getList() {
    return this.dashboards;
  }

  public setList(list: IDashboard[]) {
    this.dashboards = Object.freeze(list);
  }

  public get defaultRoute() {
    const dashboard = this.dashboards.filter(d => d.default).shift();
    return dashboard ? dashboard.route : this.dashboards[0].route;
  }

  public route(dashboardId: Dashboards) {
    const dashboard = this.dashboards.filter(d => d.id === dashboardId).shift();
    return dashboard ? dashboard.route : this.defaultRoute;
  }

  public switchTo(
    dashboardId: Dashboards,
    params?: { [key: string]: string | number | undefined }
  ) {
    const dashboard = this.dashboards.filter(d => d.id === dashboardId).shift();
    if (dashboard) {
      m.route.set(dashboard.route, params ? params : undefined);
    }
  }

  public routingTable() {
    return this.dashboards.reduce((p, c) => {
      p[c.route] =
        c.hasNavBar === false
          ? {
              render: () =>
                m(c.component, { state: this.states(), actions: this.actions }),
            }
          : {
              render: () =>
                m(
                  this.layout,
                  m(c.component, {
                    state: this.states(),
                    actions: this.actions,
                  })
                ),
            };
      return p;
    }, {} as RouteDefs);
  }
}

export const dashboardSvc: DashboardService = new DashboardService(Layout, [
  {
    id: Dashboards.HOME,
    title: 'Home',
    icon: 'home',
    route: '/',
    visible: true,
    component: EditForm,
  },
  {
    id: Dashboards.SETTINGS,
    title: 'Settings',
    icon: 'settings',
    route: '/settings',
    visible: true,
    component: EditSettings,
  },
]);
