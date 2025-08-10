import React from 'react';
import TextRatingForm from '../TextRatingForm';

interface BewertungsBoxProps {
  userId: string;
}

const BewertungsBox: React.FC<BewertungsBoxProps> = ({ userId }) => (
  <>
    <TextRatingForm userId={userId} />
  </>
);

export default BewertungsBox;
