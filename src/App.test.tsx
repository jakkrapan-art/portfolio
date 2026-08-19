import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectThumbnail } from './components/project-showcase';

test('modal thumbnail calls the modal flow', () => {
  const onClick = jest.fn();

  render(
    <ProjectThumbnail
      id={1}
      title="Dungeon Escapist"
      image="dungeon_escapist.png"
      engine="unity"
      click={{ type: 'modal' }}
      onClick={onClick}
    />
  );

  fireEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalledWith(1);
});

test('link thumbnail opens the target in a new tab', () => {
  render(
    <ProjectThumbnail
      id={2}
      title="One Min Farmer"
      image="one_min_farmer.png"
      engine="unity"
      click={{ type: 'link', url: 'https://example.com' }}
    />
  );

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', 'https://example.com');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noreferrer');
});