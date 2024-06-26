import { classes } from 'common/react';
import { useBackend } from '../../backend';
import { Box, Button, Icon, Flex, NoticeBox, Stack, ColorBox } from '../../components';
import { BoxProps } from '../../components/Box';
import { Table, TableRow } from '../../components/Table';

interface ElectricalData {
  electrical: MachineElectrical;
}

interface MachineElectrical {
  electrified: number;
  panel_open: number;
  wires: WireSpec[];
  powered: number;
}

interface WireSpec {
  desc: string;
  cut: number;
}

const ElectricalPanelClosed = (props: BoxProps) => {
  return (
    <NoticeBox
      className={classes([
        'PanelClosed',
        'ElectricalSafetySign',
        props.className,
      ])}>
      <Flex
        direction="row"
        justify="space-between"
        fill
        className="ElectricalSafetySign">
        <Flex.Item grow>
          <Flex
            justify="space-between"
            direction="column"
            fill
            className={classes(['ElectricalSafetySign'])}>
            <Flex.Item>
              <Icon name="circle-xmark" />
            </Flex.Item>
            <Flex.Item>
              <Icon name="circle-xmark" />
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item fill>
          <Flex
            justify="space-around"
            align="center"
            inline
            fill
            wrap
            className="WarningIcon"
            direction="column">
            <Flex.Item>
              <Icon name="bolt" size={2} />
            </Flex.Item>
            <Flex.Item>
              <span>
                Electrical Hazard <br />
                Authorised Personnel Only
              </span>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item grow>
          <Flex
            justify="space-between"
            align="flex-end"
            direction="column"
            fill
            className={classes(['ElectricalSafetySign'])}>
            <Flex.Item>
              <Icon name="circle-xmark" />
            </Flex.Item>
            <Flex.Item>
              <Icon name="circle-xmark" />
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    </NoticeBox>
  );
};

const WireControl = (props: {
  readonly wire: WireSpec;
  readonly index: number;
}) => {
  const { data, act } = useBackend<ElectricalData>();
  const target = props.index + 1;
  let boxColor = 'green';
  if (props.wire.cut) {
    boxColor = 'red';
  }
  if (!data.electrical.powered) {
    boxColor = 'grey';
  }
  return (
    <Stack>
      <Stack.Item grow>{props.wire.desc}</Stack.Item>
      <Stack.Item>
        <ColorBox color={boxColor} align={'center'} />
      </Stack.Item>
      <Stack.Item>
        {props.wire.cut === 0 && (
          <Button
            icon="scissors"
            onClick={() => act('cutwire', { wire: target })}
            tooltip={'Cut'}
          />
        )}
        {props.wire.cut === 1 && (
          <Button
            icon="wrench"
            onClick={() => act('fixwire', { wire: target })}
            tooltip={'Fix'}
          />
        )}
      </Stack.Item>
      <Stack.Item>
        <Button
          icon="wave-square"
          disabled={props.wire.cut === 1}
          onClick={() => act('pulsewire', { wire: target })}
          tooltip={'Pulse'}
        />
      </Stack.Item>
    </Stack>
  );
};

const ElectricalPanelOpen = (props: BoxProps) => {
  const { data } = useBackend<ElectricalData>();
  return (
    <Box className={classes(['PanelOpen', props.className])}>
      <Flex
        direction="column"
        justify="space-between"
        fill
        className="ElectricalSafetySign">
        <Flex.Item>
          <Table vertical className="WirePanel">
            {data.electrical.wires.map((x, index) => (
              <TableRow key={x.desc}>
                <WireControl wire={x} index={index} />
              </TableRow>
            ))}
          </Table>
        </Flex.Item>
        <Flex.Item>
          <NoticeBox className="OpenSafetySign" />
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export const ElectricalPanel = (props: BoxProps) => {
  const { data } = useBackend<ElectricalData>();
  const isOpen = data.electrical.panel_open === 1;
  return (
    <div className={classes(['ElectricalAccessPanel', props.className])}>
      {!isOpen && <ElectricalPanelClosed />}
      {isOpen && <ElectricalPanelOpen />}
    </div>
  );
};
