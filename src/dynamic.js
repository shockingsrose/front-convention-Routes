import React, { lazy } from 'react';
import asyncComponent from './asyncComponent';

export default function dynamic(option) {
  const { loader, Loading, meta } = option;

  const Component = asyncComponent(lazy(loader), Loading);

  Component.meta = meta;

  return Component;
}