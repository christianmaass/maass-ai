import React from 'react';
import TextRatingForm from '../features/TextRatingForm';

interface BewertungsBoxProps {
  userId: string;
}

const BewertungsBox: React.FC<BewertungsBoxProps> = ({ userId }) => (
  <>
    <TextRatingForm userId={userId} />
  </>
);

export default BewertungsBox;
