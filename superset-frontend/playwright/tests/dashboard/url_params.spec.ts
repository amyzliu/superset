/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { test, expect } from '@playwright/test';
import { TIMEOUT } from '../../utils/constants';

const WORLD_HEALTH_DASHBOARD = 'superset/dashboard/world_health/';

interface ChartDataQuery {
  url_params: Record<string, string>;
}

interface ChartDataRequestBody {
  queries: ChartDataQuery[];
}

test('url params are forwarded in chart data requests on the World Health dashboard', async ({
  page,
}) => {
  test.setTimeout(TIMEOUT.SLOW_TEST);

  const urlParams = { param1: '123', param2: 'abc' };
  const chartDataBodies: ChartDataRequestBody[] = [];

  // Intercept chart/data API requests and capture their bodies
  await page.route('**/api/v1/chart/data**', async route => {
    const request = route.request();
    if (request.method() === 'POST') {
      try {
        const body = request.postDataJSON() as ChartDataRequestBody;
        if (body?.queries) {
          chartDataBodies.push(body);
        }
      } catch {
        // Non-JSON POST body — skip
      }
    }
    await route.continue();
  });

  // Navigate to the World Health dashboard with URL params
  await page.goto(
    `${WORLD_HEALTH_DASHBOARD}?param1=${urlParams.param1}&param2=${urlParams.param2}`,
  );

  // Wait for at least one chart/data request to be captured
  await expect
    .poll(() => chartDataBodies.length, {
      timeout: TIMEOUT.API_RESPONSE,
      message: 'Expected at least one chart/data request',
    })
    .toBeGreaterThan(0);

  // Every query in every captured request should carry the url_params
  for (const body of chartDataBodies) {
    for (const query of body.queries) {
      expect(query.url_params).toEqual(urlParams);
    }
  }
});
