import React from 'react';
import { render, act } from '@testing-library/react';
import { shouldMatchSnapshot } from '@bbc/psammead-test-helpers';
import WithLoading from '.';

global.scrollTo = jest.fn();

const wait = duration =>
  new Promise(resolve => {
    setTimeout(resolve, duration);
  });

describe('withLoading HOC', () => {
  const Component = () => <h1>Hola</h1>;
  const LoadingHOC = WithLoading(Component);

  describe('and the loading prop set to true', () => {
    shouldMatchSnapshot(
      `should return the loading component`,
      <LoadingHOC loading pageType="article" />,
    );
  });

  describe('and no loading prop', () => {
    shouldMatchSnapshot(
      `should return the passed in component`,
      <LoadingHOC pageType="article" />,
    );
  });

  describe(`and the loading indicator`, () => {
    // Reinstate after conditional loading logic is re-added
    // it(`should not show the loading indicator before a set amount of time`, async () => {
    //   let queryByTestId;

    //   await act(async () => {
    //     ({ queryByTestId } = render(<LoadingHOC loading />));

    //     await wait(400);
    //   });

    //   expect(queryByTestId('loading')).not.toBeInTheDocument();
    // });

    it(`should show the loading indicator after a set amount of time`, async () => {
      let queryByTestId;

      await act(async () => {
        ({ queryByTestId } = render(<LoadingHOC loading pageType="article" />));

        await wait(600);
      });

      expect(queryByTestId('loading')).toBeInTheDocument();
    });

    it(`should not show the loading indicator if loading is false (even after a set amount of time)`, async () => {
      let queryByTestId;

      await act(async () => {
        ({ queryByTestId } = render(
          <LoadingHOC loading={false} pageType="article" />,
        ));

        await wait(600);
      });

      expect(queryByTestId('loading')).not.toBeInTheDocument();
    });

    it(`should be focused after a set amount of time`, async () => {
      let queryByTestId;

      await act(async () => {
        ({ queryByTestId } = render(<LoadingHOC loading pageType="article" />));

        await wait(600);
      });

      expect(queryByTestId('loading')).toHaveFocus();
    });

    it(`should not be focused before a set amount of time`, async () => {
      let queryByTestId;

      await act(async () => {
        ({ queryByTestId } = render(<LoadingHOC loading pageType="article" />));

        await wait(400);
      });

      expect(queryByTestId('loading')).not.toHaveFocus();
    });
  });

  it(`should show the loading skeleton after a set amount of time`, async () => {
    let queryByTestId;

    await act(async () => {
      ({ queryByTestId } = render(<LoadingHOC loading pageType="article" />));

      await wait(600);
    });

    expect(queryByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it(`should not show the skeleton a set amount of time`, async () => {
    let queryByTestId;

    await act(async () => {
      ({ queryByTestId } = render(<LoadingHOC loading pageType="article" />));

      await wait(400);
    });

    expect(queryByTestId('loading-skeleton')).not.toBeInTheDocument();
  });

  it(`should not show the skeleton if not defined for page type`, async () => {
    let queryByTestId;

    await act(async () => {
      ({ queryByTestId } = render(<LoadingHOC loading pageType="radio" />));

      await wait(600);
    });

    expect(queryByTestId('loading-skeleton')).not.toBeInTheDocument();
  });
});
