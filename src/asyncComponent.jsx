
import React, { Suspense, useEffect, useState } from 'react';

export default async function asyncComponent(asyncLoad, Loading = <p>Loading...</p>) {
  const { default: Child, meta } = await asyncLoad();
  return {
    component: Child,
    meta
  }
}


