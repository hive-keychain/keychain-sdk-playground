import { KeychainRequestTypes } from 'hive-keychain-commons';
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Modal,
} from 'react-bootstrap';
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import { requestCategories } from '../reference-data/requests-categories';

type Props = {
  show: boolean;
  onHide: () => void;
  setRequest: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const SearchModal = ({ show, onHide, setRequest }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [activeKeyAccordionCategory, setActiveKeyAccordionCategory] =
    useState('');

  const handleChange = (e: any) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const handleOnClickItem = (requestItemType: string) => {
    setRequest(requestItemType);
    onHide();
  };

  useEffect(() => {
    if (searchValue && searchValue.trim().length !== 0) {
      const indexCategoryFound = requestCategories.findIndex((cat) => {
        if (
          cat.category.toLowerCase().search(searchValue.toLowerCase()) !== -1
        ) {
          return true;
        }
        return false;
      });
      console.log({ foundOnIndex: indexCategoryFound });
      if (indexCategoryFound !== -1) {
        setActiveKeyAccordionCategory(indexCategoryFound.toString());
      }
    }else{
      setActiveKeyAccordionCategory('');
    }
  }, [searchValue]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Search Keychain Request </Modal.Title>
        <Form onSubmit={() => {}}>
          <InputGroup>
            <Form.Control
              title="Type to show content bellow"
              placeholder="type to search"
              name="search_value"
              value={searchValue}
              onChange={handleChange}
            />
          </InputGroup>
        </Form>
      </Modal.Header>
      <Modal.Body>
        <Accordion
          activeKey={activeKeyAccordionCategory}
          onSelect={(e: AccordionEventKey) =>
            setActiveKeyAccordionCategory(e as string)
          }>
          {requestCategories.map((cat, index) => {
            return (
              <Accordion.Item
                eventKey={index.toString()}
                key={cat.category + index}>
                <Accordion.Header>{cat.category}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup>
                    {cat.items.map((catItem) => {
                      return (
                        <ListGroup.Item
                          action
                          onClick={() => handleOnClickItem(catItem.requestType)}
                          key={catItem.requestType}>
                          {catItem.name}
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchModal;
