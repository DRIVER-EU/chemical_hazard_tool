import m, { Vnode } from 'mithril';
import { Icon } from 'mithril-materialized';
import logo from '../assets/explosion.svg';
import { IDashboard } from '../models';
import { dashboardSvc } from '../services/dashboard-service';

const stripRouteParams = (path: string) => path.replace(/:[a-zA-Z]+/, '');

const isActiveRoute = (route = m.route.get()) => (path: string) =>
  path.length > 1 && route.indexOf(stripRouteParams(path)) >= 0
    ? '.active'
    : '';

export const Layout = () => ({
  view: (vnode: Vnode) => {
    const isActive = isActiveRoute();
    return m('.main', [
      m(
        '.navbar',
        { style: 'z-index: 1001' },
        m(
          'nav',
          m('.nav-wrapper', [
            m('a.brand-logo[href=#]', [
              m(`img[width=100][height=45][src=${logo}]`, {
                style: 'margin: 7px 0 0 5px;',
              }),
              m(
                'div',
                {
                  style:
                    'margin-top: 0px; position: absolute; top: 16px; left: 50px; width: 400px;',
                },
                m(
                  'h4.center.hide-on-med-and-down',
                  {
                    style:
                      'text-align: left; margin: -7px 0 0 60px; background: #01689B',
                  },
                  'Chemical Hazard Tool'
                )
              ),
            ]),
            m(
              // 'a.sidenav-trigger[href=#!/home][data-target=slide-out]',
              // { onclick: (e: UIEvent) => e.preventDefault() },
              m.route.Link,
              {
                className: 'sidenav-trigger',
                'data-target': 'slide-out',
                href: m.route.get(),
              },
              m(Icon, {
                iconName: 'menu',
                className: '.hide-on-med-and-up',
                style: 'margin-left: 5px;',
              })
            ),
            m(
              'ul.right',
              dashboardSvc
                .getList()
                .filter(d => d.visible || isActive(d.route))
                .map((d: IDashboard) =>
                  m(
                    `li${isActive(d.route)}`,
                    m(
                      m.route.Link,
                      { href: d.route },
                      m(
                        'span',
                        d.icon
                          ? m(
                              'i.material-icons.white-text',
                              typeof d.icon === 'string' ? d.icon : d.icon()
                            )
                          : d.title
                      )
                    )
                  )
                )
            ),
          ])
        )
      ),
      m('.container', vnode.children),
    ]);
  },
});
